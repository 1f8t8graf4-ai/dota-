#!/usr/bin/env python3
# data/map-timers.json — тайминги объектов карты Deadlock (ТЗ v19 п.4).
# Источники: deadlock.wiki (страницы Haunt, Crate, Buff Container, Soul Urn, Midboss, Powerups)
# + сверка количеств с api.deadlock-api.com/v1/assets/map (снято 29.10.2026).
import json, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
W = "https://deadlock.wiki/wiki/"

data = {
    "updated": "2026-10-29",
    "patch_state": "City Never Sleeps (29.09.2026) + Minor 14.10.2026",
    "time_format": "ММ:СС игрового таймера",
    "objects": [
        {
            "type": "camp",
            "en": "Neutral Camp (Haunt)",
            "ru": "Лагерь нейтралов (Хонты)",
            "sizes": [
                {"size": "s", "ru": "малый", "tier": 1, "spawn": "2:00", "respawn": "1:25"},
                {"size": "m", "ru": "средний", "tier": 2, "spawn": "5:00", "respawn": "4:50"},
                {"size": "l", "ru": "большой", "tier": 3, "spawn": "8:00", "respawn": "5:35"},
            ],
            "notes": [
                "Респавн считается от убийства ПОСЛЕДНЕГО монстра в лагере; лагерь встаёт целиком.",
                "Если оставить в лагере одного живого — остальные не вернутся, пока он жив.",
                "Лагеря статичны: состав, семья и тиры в каждой точке всегда одинаковые.",
            ],
            "src": W + "Haunt",
        },
        {
            "type": "crate",
            "en": "Crate",
            "ru": "Ящик",
            "timings": [
                {"where": "большинство", "spawn": "3:00", "respawn": "3:00 после разбития"},
                {"where": "зал под Times Square, прямо над ямой мидбосса", "spawn": "10:00", "respawn": "3:00"},
                {"where": "верх Колокольни (Bell Tower) и Sunken Plaza", "spawn": "5:00", "respawn": "3:00"},
                {"where": "тоннели", "spawn": "5:00", "respawn": "5:00"},
            ],
            "notes": [
                "Дают Haunted Souls; не собранные души откладывают респавн.",
                "Души ящиков считаются в послематчевой статистике как «Breakable Pickups».",
            ],
            "history": [
                {"date": "2026-09-16", "what": "тоннели: первый спавн и респавн увеличены с 3:00 до 5:00", "src": W + "Crate"},
                {"date": "2026-05-22", "what": "спавн ящиков увеличен с 2 до 3 минут", "src": W + "Crate"},
            ],
            "count_api": 423,
            "src": W + "Crate",
        },
        {
            "type": "tough_crate",
            "en": "Tough Crate",
            "ru": "Крепкий ящик",
            "timings": [
                {"where": "те же тайминги, что у обычных ящиков (отдельного числа в вики нет)", "spawn": "3:00", "respawn": "3:00"},
            ],
            "notes": [
                "Вскрывается только тяжёлым ближним ударом (Heavy Melee).",
                "Добавлены 29.09.2026 (City Never Sleeps).",
                "Апгрейды тяжёлого удара у Puddle Punch / Rend / Bashdown их НЕ открывают; рыцари Rallying Charge — открывают.",
            ],
            "count_api": 74,
            "src": W + "Crate",
        },
        {
            "type": "golden_statue",
            "en": "Golden Statue (Buff Container)",
            "ru": "Золотая статуя (сосуд баффа)",
            "timings": [
                {"where": "большинство", "spawn": "3:00", "respawn": "3:00 после разбития"},
                {"where": "зал под Times Square", "spawn": "10:00", "respawn": "3:00"},
                {"where": "тоннели", "spawn": "5:00", "respawn": "5:00"},
            ],
            "notes": [
                "Разбивается — даёт постоянный бафф. Уровень баффа зависит от времени: L1 в начале, L2 после 10:00, L3 после 30:00.",
                "Дроп учитывает ВСЕ разбитые статуи, включая баффы, которые никто не подобрал — манипулировать дропом не подбирая нельзя.",
                "Неподобранный бафф откладывает респавн.",
            ],
            "count_api": 166,
            "src": W + "Buff_Container",
        },
        {
            "type": "bridge_buff",
            "en": "Powerup (Bridge Buff / Rune)",
            "ru": "Мостовой бафф (руна)",
            "spawn": "5:00",
            "interval": "каждые 5:00",
            "notes": [
                "Светящийся камень на мостах у точек урны (спавн и дроп).",
                "На 5:00 бафф случайный; на 10:00 гарантированно появляются два других вида (ротация без повторов).",
                "Сила растёт с 5-й по 40-ю минуту.",
                "С 8.05.2025 миникарта показывает, какой бафф появился.",
            ],
            "count_api": 2,
            "src": W + "Powerups",
        },
        {
            "type": "urn",
            "en": "Soul Urn",
            "ru": "Урна душ",
            "spawn": "10:00",
            "interval": "каждые 5:00, чередуя линии",
            "notes": [
                "Первая урна всегда на жёлтой линии (Yellow), дальше — чередование жёлтая/зелёная.",
                "Если урну не подобрали за 3 минуты, она сама идёт к точке сдачи через лестницу мидбосса и исчезает примерно на полпути.",
                "Если подобрали до следующего респавна, новый респавн откладывается до доставки или истечения.",
                "База 250 душ + 70 за минуту матча; значение фиксируется в момент спавна.",
            ],
            "history": [
                {"date": "2026-05-22", "what": "реворк: урна даёт команде с меньшим числом душ резисты в радиусе", "src": W + "Soul_Urn"},
            ],
            "count_api": 6,
            "src": W + "Soul_Urn",
        },
        {
            "type": "midboss",
            "en": "Midboss",
            "ru": "Мидбосс",
            "spawn": "есть с начала матча (спит в канализации под центром карты)",
            "respawns": [
                {"after": "первая смерть", "time": "7:00"},
                {"after": "вторая смерть", "time": "6:00"},
                {"after": "третья и далее", "time": "5:00"},
            ],
            "notes": [
                "Таймер респавна виден на миникарте (заполнение иконки); Tab показывает точное время.",
                "За убийство: 3000 душ (+50/мин), 2 постоянных баффа каждому и кристалл Реаниматора ( revive в течение 3 минут).",
            ],
            "src": W + "Midboss",
        },
    ],
    "cross_check": {
        "checked": "2026-10-29",
        "api": "https://api.deadlock-api.com/v1/assets/map",
        "neutral_camps": {"api": 51, "wiki": "суммарного числа на вики нет (перечислены по размерам)"},
        "crates": {"api": 423, "wiki": "518 («There are 518 crates on the map»)", "diff": "вики заявляет на 95 больше, чем entities/crates в API; вероятно, вики считает иначе (или API выгружает не все брейкаблы) — нужно сверить по скрину из игры"},
        "tough_crates": {"api": 74, "wiki": "числа нет, объект добавлен 29.09.2026"},
        "golden_statues": {"api": 166, "wiki": "числа нет"},
    },
}

def main():
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "map-timers.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"map-timers.json: {len(data['objects'])} типов объектов, сверка по {data['cross_check']['checked']}")

if __name__ == "__main__":
    main()
