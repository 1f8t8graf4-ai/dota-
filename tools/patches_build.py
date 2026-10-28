#!/usr/bin/env python3
# Сборка data/patches.json (последние 5 патчей) + data/patch-words.json (30 слов).
# Источник: deadlock.wiki Update: страницы + Steam news (ссылки в src).
# Правило ТЗ: числа как в патчноуте, названия способностей/предметов по-английски,
# нет числа "было" — "—", мат не добавлять.
import json, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")

W = "https://deadlock.wiki/wiki/Update:"

patches = [
    {
        "date": "2026-10-20",
        "title": "Shh... This Won't Hurt a Bit.",
        "size": "big",
        "src": "https://store.steampowered.com/news/app/1422450/view/669505296465396778",
        "changes": [
            {"k": "nurse-harrow", "t": "new", "ty": "new",
             "h": "Новый герой — Нёрс Харроу",
             "rows": [
                 ["Leech Therapy — бросок банки с пиявками", "—", "цепляется к врагам, вытягивает здоровье и энергию, пиявки ползут назад и приносят добычу"],
                 ["Wretched Vapors — склянка с парами", "—", "усиливает союзников; когда пары заканчиваются — побочные эффекты"],
                 ["Healing Needles — шприц с иглами", "—", "лечит союзников прямо в вены"],
                 ["Lurking Terrors — ульт, открывает сумку", "—", "выпускает терроров, враги разбегаются по укрытиям"],
             ],
             "src": W + "October_20,_2026#Heroes"},
            {"k": "map", "t": "change", "ty": "map",
             "h": "Карта: закусочная и магазины синей линии (без упоминания в патчноутах)",
             "rows": [
                 ["Diner (синяя линия)", "—", "обновлена"],
                 ["Salt & Chalk (скрытый магазин Короля, синяя линия)", "—", "обновлено здание"],
             ],
             "src": W + "October_20,_2026#Undocumented_changes"},
        ],
    },
    {
        "date": "2026-10-16",
        "title": "Paint the Town",
        "size": "big",
        "src": "https://store.steampowered.com/news/app/1422450/view/669505296465396531",
        "changes": [
            {"k": "violet", "t": "new", "ty": "new",
             "h": "Новый герой — Вайолет, художница",
             "rows": [
                 ["Living Ink — живые чернила", "—", "усиливают пули и превращают вдохновение в реальность"],
                 ["Flow State", "—", "чернила плывут к опасности (урон) или от неё (побег)"],
                 ["Still Life", "—", "натюрморт: захватывает точный облик врага"],
                 ["Abstract Landscape — ульт", "—", "окружает себя и рядом стоящих крупнейшей работой; зрители теряют дар речи"],
             ],
             "src": W + "October_16,_2026#Heroes"},
            {"k": "map", "t": "change", "ty": "map",
             "h": "Карта: синяя линия (без упоминания в патчноутах)",
             "rows": [
                 ["Diner (синяя линия)", "—", "обновлена"],
                 ["Drug Store (синяя линия)", "—", "обновлена"],
             ],
             "src": W + "October_16,_2026#Undocumented_changes"},
            {"k": "solomon", "t": "change", "ty": "hero",
             "h": "Соломон: перемещение королём — по кнопке способности",
             "rows": [
                 ["Kingside Knight: движение королём", "—", "теперь по кнопке способности (без упоминания в патчноутах)"],
             ],
             "src": W + "October_16,_2026#Undocumented_changes"},
        ],
    },
    {
        "date": "2026-10-14",
        "title": "Minor Update - 10-14-2026",
        "size": "big",
        "src": "https://store.steampowered.com/news/externalpost/steam_community_announcements/1846651706676198",
        "changes": [
            {"k": "baba", "t": "nerf", "ty": "hero",
             "h": "Бабу ослабили: сопротивления, откат Threadsap и Brew",
             "rows": [
                 ["Stats: Spirit Resistance scaling", "0.12", "0.1"],
                 ["Stats: Base Bullet Resistance", "—", "-7%"],
                 ["Threadsap: снятие спирита с врага заканчивается", "—", "когда Баба умирает"],
                 ["Threadsap: Cooldown", "26s", "28s"],
                 ["Granny Long Legs: Cooldown", "30s", "32s"],
                 ["Granny Long Legs: повторные лёгкие удары в воздухе", "—", "затухающий рывок вперёд"],
                 ["Granny Long Legs: подброс лёгким ударом вверх", "—", "уменьшен (взгляд вверх больше не поднимает так высоко)"],
                 ["Granny Long Legs: ground pound тяжёлым ударом", "—", "не даёт горизонтальной скорости при посадке на склоны"],
                 ["Baba's Brew: Barrier scaling", "1.2", "0.7"],
                 ["Baba's Brew: Barrier", "100", "90"],
                 ["Baba's Brew: Cooldown", "25s", "27s (перенесён на T2)"],
             ],
             "src": W + "October_14,_2026#Heroes"},
            {"k": "deadman-danny", "t": "buff", "ty": "hero",
             "h": "Дэнни усилили: здоровье, пушка, Chimera, Strix Salvo",
             "rows": [
                 ["Stats: Health regen", "2.5", "3.25"],
                 ["Stats: Base health", "680", "730"],
                 ["Stats: пушка, uncharged shots", "12", "15"],
                 ["Stats: пушка, charged shots", "44", "48"],
                 ["Stats: Close the Deal, 1AP", "+50", "+90"],
                 ["Stats: Chimera Mk1, 5AP — Cooldown on Hit (без упоминания)", "-40%", "-50%"],
                 ["Stats: Rocket Jumping — урон себе", "6.5% max HP", "5% max HP, теперь spirit damage"],
                 ["Chimera Mk1: Cooldown boon scaling", "-0.25", "-0.45"],
                 ["Chimera Mk1: Heal on hit spirit scaling", "1", "2"],
                 ["Chimera Mk1: Weapon scaling", "1.15", "1.4"],
                 ["Chimera Mk1: Slow effectiveness в воздухе", "—", "снижено на 15%"],
                 ["Chimera Mk1: урон себе (без упоминания)", "12% max HP", "10% max HP"],
                 ["Strix Salvo: Cooldown", "30s", "25s"],
                 ["Strix Salvo: Damage spirit scaling", "0.9", "1.1"],
                 ["Strix Salvo: T2", "+20 damage / +35 mark damage", "+30 damage / +45 mark damage"],
                 ["Strix Salvo: T3, spirit scaling", "+0.2", "+0.35"],
                 ["Close The Deal: бонусный урон по целям ниже половины здоровья", "+50%", "+75%"],
             ],
             "src": W + "October_14,_2026#Heroes"},
            {"k": "baba", "t": "nerf", "ty": "fix",
             "h": "Street Brawl: пряжа Бабы короче",
             "rows": [
                 ["Threadsap: длительность в Street Brawl", "—", "на 35% короче"],
             ],
             "src": W + "October_14,_2026#Street_Brawl"},
            {"k": "item:Radiant Regeneration", "t": "nerf", "ty": "item",
             "h": "Предмет Radiant Regeneration ослаблен",
             "rows": [
                 ["Spirit scaling", "0.04", "0.035"],
             ],
             "src": W + "October_14,_2026#Items"},
        ],
    },
    {
        "date": "2026-10-09",
        "title": "Make Your Move.",
        "size": "big",
        "src": "https://store.steampowered.com/news/app/1422450/view/703281660030879519",
        "changes": [
            {"k": "solomon", "t": "new", "ty": "new",
             "h": "Новый герой — Соломон, шахматист",
             "rows": [
                 ["Setup Bishop", "—", "выставляет пешек-стрелков и плавно сдвигает их по улицам"],
                 ["Kingside Knight", "—", "защита союзникам и тактические отходы"],
                 ["Rook Battery", "—", "ладья несётся вперёд и останавливает врагов"],
                 ["Develop Queen — ульт", "—", "запирает врагов, шах и мат"],
             ],
             "src": W + "October_9,_2026#Heroes"},
            {"k": "map", "t": "change", "ty": "map",
             "h": "Карта: новые канаты, мосты и коридоры (без упоминания в патчноутах)",
             "rows": [
                 ["Канаты, мосты, проходы в некоторых местах", "—", "добавлены"],
             ],
             "src": W + "October_9,_2026#Undocumented_changes"},
            {"k": "viscous", "t": "change", "ty": "hero",
             "h": "Визкоус: ремастер озвучки (без упоминания в патчноутах)",
             "rows": [
                 ["VO: недавно добавленные реплики и новый контент", "—", "перезаписаны"],
             ],
             "src": W + "October_9,_2026#Undocumented_changes"},
        ],
    },
    {
        "date": "2026-10-06",
        "title": "Mind the Birds!",
        "size": "big",
        "src": "https://store.steampowered.com/news/app/1422450/view/703281025618282871",
        "changes": [
            {"k": "baba", "t": "new", "ty": "new",
             "h": "Новый герой — Баба с голубями",
             "rows": [
                 ["Threadsap", "—", "бросает клубок пряжи, крадёт спирит врагов и усиливается"],
                 ["Скамья", "—", "оживает: бег, прыжки, удары с разгона"],
                 ["Baba's Brew", "—", "плеснуть чаем: некоторые слаще других"],
                 ["The Birds — ульт", "—", "птицы выходят играть"],
             ],
             "src": W + "October_6,_2026#Heroes"},
            {"k": "system", "t": "change", "ty": "fix",
             "h": "Первый рейтедовый сезон продлён до 5 ноября",
             "rows": [
                 ["Конец первого Ranked-сезона", "—", "перенесён на четверг 5 ноября 2026, 14:00 PDT; следующий стартует сразу после"],
             ],
             "src": W + "October_6,_2026#Notes"},
        ],
    },
]

words = [
    {"en": "buff", "ru": "усиление", "ex": "Health regen increased from 2.5 to 3.25"},
    {"en": "nerf", "ru": "ослабление", "ex": "Spirit Resistance scaling reduced from 0.12 to 0.1"},
    {"en": "cooldown", "ru": "откат способности (CD)", "ex": "Cooldown increased from 30s to 32s"},
    {"en": "scaling", "ru": "прибавка от силы героя (масштабирование)", "ex": "Damage spirit scaling from 0.9 to 1.1"},
    {"en": "spirit power", "ru": "сила спирита (второй тип урона)", "ex": "now spirit damage"},
    {"en": "bullet damage", "ru": "урон пулями", "ex": "Base bullet damage for uncharged shots from 12 to 15"},
    {"en": "health regen", "ru": "восстановление здоровья", "ex": "Health regen increased from 2.5 to 3.25"},
    {"en": "base health", "ru": "базовое здоровье", "ex": "Base health increased from 680 to 730"},
    {"en": "undocumented", "ru": "не упомянуто в патчноутах", "ex": "(Undocumented) Self damage reduced from 12% max HP to 10%"},
    {"en": "charged shot", "ru": "заряженный выстрел", "ex": "charged shots from 44 to 48"},
    {"en": "bullet resistance", "ru": "сопротивление пулям", "ex": "Now has -7% Base Bullet Resistance"},
    {"en": "spirit resistance", "ru": "сопротивление спириту", "ex": "Spirit Resistance scaling reduced from 0.12 to 0.1"},
    {"en": "barrier", "ru": "барьер, временный щит", "ex": "Barrier reduced from 100 to 90"},
    {"en": "melee", "ru": "ближний удар (оружие вплотную)", "ex": "Repeat light melees while airborne"},
    {"en": "light melee", "ru": "лёгкий ближний удар", "ex": "Repeat light melees while airborne now have diminishing forward momentum"},
    {"en": "heavy melee", "ru": "тяжёлый ближний удар", "ex": "Heavy melee ground pound no longer gains horizontal speed"},
    {"en": "ground pound", "ru": "удар о землю с прыжка", "ex": "Heavy melee ground pound no longer gains horizontal speed when landing on slopes"},
    {"en": "max HP", "ru": "максимальный запас здоровья", "ex": "Self damage from 6.5% max HP to 5%"},
    {"en": "AP (ability point)", "ru": "очко прокачки способности", "ex": "Close the Deal - 1AP increased from +50 to +90"},
    {"en": "on hit", "ru": "при попадании", "ex": "-40% Cooldown on Hit"},
    {"en": "slow", "ru": "замедление", "ex": "Slow effectiveness in air reduced by 15%"},
    {"en": "diminishing", "ru": "затухающий, всё слабее", "ex": "now have diminishing forward momentum"},
    {"en": "duration", "ru": "длительность эффекта", "ex": "duration lasts 35% less"},
    {"en": "release", "ru": "выход (героя, патча)", "ex": "Solomon is available in-game now"},
    {"en": "ranked season", "ru": "сезон рейтинговых игр", "ex": "the end date for our first Ranked season has been pushed back"},
    {"en": "pushed back", "ru": "перенесён на позже", "ex": "end date ... has been pushed back to Thursday November 5th"},
    {"en": "VO (voice over)", "ru": "озвучка", "ex": "Updated VO pass for Viscous"},
    {"en": "remastered", "ru": "перезаписан, сделан заново (про звук)", "ex": "Remastered recently added voice lines"},
    {"en": "turnout", "ru": "явка, сколько людей пришло", "ex": "Big Turnout: Over 110 Million votes were cast"},
    {"en": "win rate", "ru": "процент побед", "ex": "Nurse Harrow voters consistently proved to have a higher win rate"},
]

def main():
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "patches.json"), "w", encoding="utf-8") as f:
        json.dump(patches, f, ensure_ascii=False, indent=1)
    with open(os.path.join(OUT, "patch-words.json"), "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=1)
    n = sum(len(p["changes"]) for p in patches)
    print(f"patches.json: {len(patches)} патчей, {n} изменений; patch-words.json: {len(words)} слов")

if __name__ == "__main__":
    main()
