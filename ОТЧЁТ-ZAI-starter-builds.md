# EVIDENCE — starter-builds (44 героя Deadlock)

Дата сбора данных: 2026-11-04. Источник: публичный API `api.deadlock-api.com` (без ключей, ничего не изменялось в аккаунтах).
Окно данных: последние 30 дней (дефолт `min_unix_timestamp` у обоих аналитических эндпоинтов), режимы матчей: ranked+unranked (дефолт).

## Использованные эндпоинты (все существуют, проверено по /openapi.json и реальными запросами)

| Эндпоинт | Назначение |
|---|---|
| `GET /v1/assets/heroes?only_active=true` | Список играбельных героев (44 шт.: `player_selectable=true`, `disabled=false`; у Violet и Baba поле `in_development=true`, но они выбору доступны и включены фильтром `only_active`) |
| `GET /v1/analytics/hero-stats` | Средний винрейт каждого героя (wins/matches) |
| `GET /v1/analytics/hero-build-stats/{hero_id}?min_matches=200` | Статистика сборок героя: `hero_build_id`, matches, wins за 30 дней |
| `GET /v1/builds/{hero_id}/{build_id}` | Проверка существования сборки по ID + её предметы (названия/ID) |
| `GET /v1/assets/items` | Справочник предметов: имя, тип, tier, стоимость |

Примечание: эндпоинта `/v1/hero_stats` не существует — используется `/v1/analytics/hero-stats`. Поиск сборки «по ID» реализован запросом `GET /v1/builds/{hero_id}/{build_id}` (прямой фетч; ошибка/404, если сборки нет). Дополнительно поиск по ID работает и через `GET /v1/builds?build_id=...&hero_id=...`.

## Методика

1. Для каждого героя: кандидаты = сборки с `matches >= 200` за 30 дней и `винрейт >= средний винрейт героя`; сортировка по числу матчей (по популярности).
2. Кандидаты проверяются по `/v1/builds/{hero_id}/{build_id}` (сборка реально существует по ID) и на «простоту для новичка»: первые 6 предметов — все tier 1–2 (стоимость ≤ 1600 душ, понятные базовые: патроны, живучесть, простое оружие). Берётся первый проходящий кандидат.
3. `items` = первые 6 `ability_id` из категорий сборки по порядку (раздел «Early» и далее).
4. Винрейты честно посчитаны из API: сборка = `wins/matches` сборки; герой = `wins/matches` из `/v1/analytics/hero-stats` (то же окно 30 дней, те же режимы матчей — сравнение корректное).

## Результат по каждому герою (44/44 закрыты сборкой, null — 0)

| Герой (id) | build_id | Название сборки | Матчи (30д) | WR сборки | WR героя | Первый предмет | Источник |
|---|---|---|---|---|---|---|---|
| Infernus (1) | 256053 | SN\|P3R : Molten Fury | 114720 | 50.9% | 49.2% | Rapid Rounds | https://api.deadlock-api.com/v1/builds/1/256053 |
| Seven (2) | 87795 | Ball Out with Seven | 43655 | 57.8% | 54.8% | Monster Rounds | https://api.deadlock-api.com/v1/builds/2/87795 |
| Vindicta (3) | 317823 | Vindicta - Gun-Long Range [59% WR] [tracklock.gg] | 105391 | 49.3% | 49.2% | High-Velocity Rounds | https://api.deadlock-api.com/v1/builds/3/317823 |
| Lady Geist (4) | 722321 | Lady Geist - CARRY BOMB - deadlocked.gg | 108315 | 54.5% | 51.3% | Mystic Regeneration | https://api.deadlock-api.com/v1/builds/4/722321 |
| Abrams (6) | 697756 | Rumples 1v11 Abrams 11/1 | 88422 | 53.8% | 51.6% | Restorative Shot | https://api.deadlock-api.com/v1/builds/6/697756 |
| Wraith (7) | 236409 | Hybrid tesla shred - twitch.tv/risindarkknight | 18768 | 52.6% | 50.7% | Monster Rounds | https://api.deadlock-api.com/v1/builds/7/236409 |
| McGinnis (8) | 317827 | McGinnis - Bruiser-Crowd Control [62% WR] [tracklock.gg] | 21275 | 51.6% | 48.6% | Monster Rounds | https://api.deadlock-api.com/v1/builds/8/317827 |
| Paradox (10) | 147819 | Twitch.tv/AverageJonas CARBINE PARADOX | 17318 | 46.5% | 46.1% | Restorative Shot | https://api.deadlock-api.com/v1/builds/10/147819 |
| Dynamo (11) | 663674 | THE BIGGEST THE LARGEST | 21214 | 53.3% | 51.8% | Extra Stamina | https://api.deadlock-api.com/v1/builds/11/663674 |
| Kelvin (12) | 722326 | Kelvin - THE CARRY MACHINE - deadlocked.gg | 36828 | 55.7% | 54.2% | Extra Charge | https://api.deadlock-api.com/v1/builds/12/722326 |
| Haze (13) | 262104 | SN\|P3R : Dance of Death | 106949 | 56.6% | 53.7% | Extended Magazine | https://api.deadlock-api.com/v1/builds/13/262104 |
| Holliday (14) | 812049 | twitch.tv/wraithcrw NEW HYBRID HOLLIDAY 3.0 | 1007 | 48.8% | 47.2% | Headshot Booster | https://api.deadlock-api.com/v1/builds/14/812049 |
| Bebop (15) | 701040 | prez54 bomba (hutch is Fat) | 88889 | 50.2% | 48.3% | Mystic Burst | https://api.deadlock-api.com/v1/builds/15/701040 |
| Calico (16) | 680330 | I'm gonna burst [REBORN] | 37678 | 48.2% | 48.1% | Melee Lifesteal | https://api.deadlock-api.com/v1/builds/16/680330 |
| Grey Talon (17) | 581110 | MikaelS Greentalon [Lockbuilds.com] | 50769 | 48.9% | 47.2% | Mystic Burst | https://api.deadlock-api.com/v1/builds/17/581110 |
| Mo & Krill (18) | 540641 | Mo has been Krilled #RIP#BUFFMO(Annotated) | 61863 | 53.2% | 49.7% | Mystic Expansion | https://api.deadlock-api.com/v1/builds/18/540641 |
| Shiv (19) | 377503 | PREDATOR HUNTER (STAND STRONG SPIRIT SOLDIER) | 58579 | 44.9% | 44.7% | Restorative Shot | https://api.deadlock-api.com/v1/builds/19/377503 |
| Ivy (20) | 491693 | ГАРГУЛЯ ЧЕРЕЗ ФИНАНСОВУЮ ГРАМОТНОСТЬ | 8944 | 55.2% | 52.7% | Extra Charge | https://api.deadlock-api.com/v1/builds/20/491693 |
| Warden (25) | 317839 | Warden - Gun-Vampiric [54% WR] [tracklock.gg] | 45318 | 48.3% | 47.9% | High-Velocity Rounds | https://api.deadlock-api.com/v1/builds/25/317839 |
| Yamato (27) | 751541 | Lystic's YAMATO [Lockbuilds.com] | 41986 | 49.0% | 47.3% | Restorative Shot | https://api.deadlock-api.com/v1/builds/27/751541 |
| Lash (31) | 444606 | axl's Stylish® Lash | 72428 | 51.3% | 50.9% | Mystic Burst | https://api.deadlock-api.com/v1/builds/31/444606 |
| Viscous (35) | 275231 | AndrewChicken's NEW Fistcous Build (Annotated) | 15315 | 50.4% | 45.8% | Close Quarters | https://api.deadlock-api.com/v1/builds/35/275231 |
| Pocket (50) | 418259 | Пакет АТБ | 3911 | 44.6% | 44.5% | Restorative Shot | https://api.deadlock-api.com/v1/builds/50/418259 |
| Mirage (52) | 632506 | GUN/CURSE Mirage [Lockbuilds.com] | 38011 | 47.5% | 44.4% | Mystic Regeneration | https://api.deadlock-api.com/v1/builds/52/632506 |
| Vyper (58) | 757970 | im "vyper" brick | 24686 | 49.5% | 46.3% | Close Quarters | https://api.deadlock-api.com/v1/builds/58/757970 |
| Sinclair (60) | 612084 | data \| Master of Magic | 1490 | 46.2% | 45.1% | Extra Spirit | https://api.deadlock-api.com/v1/builds/60/612084 |
| Mina (63) | 240025 | Kari's 1 v 11 Spirit Mina build | 96557 | 46.3% | 45.4% | Extra Spirit | https://api.deadlock-api.com/v1/builds/63/240025 |
| Drifter (64) | 641585 | DRIFTER- DPS GUN | 119888 | 52.1% | 50.4% | Close Quarters | https://api.deadlock-api.com/v1/builds/64/641585 |
| Venator (65) | 449184 | WAPPLE'S CATHOLIC DADDY BUILD | 69450 | 48.1% | 47.1% | Restorative Shot | https://api.deadlock-api.com/v1/builds/65/449184 |
| Victor (66) | 491030 | ZXC БОХ СМЕРТИ | 9280 | 55.9% | 54.2% | Sprint Boots | https://api.deadlock-api.com/v1/builds/66/491030 |
| Paige (67) | 722347 | BEST SUPPORT PAIGE BUILD - deadlocked.gg | 106136 | 56.1% | 56.0% | High-Velocity Rounds | https://api.deadlock-api.com/v1/builds/67/722347 |
| The Doorman (69) | 722348 | The Doorman - NO VACANCY - deadlocked.gg | 30682 | 46.8% | 45.9% | High-Velocity Rounds | https://api.deadlock-api.com/v1/builds/69/722348 |
| Billy (72) | 332119 | twitch.tv/togetherdl | 12259 | 48.6% | 48.0% | Close Quarters | https://api.deadlock-api.com/v1/builds/72/332119 |
| Graves (76) | 783060 | Chemical Burns (Dr. Spooki von Spookenstein) | 47809 | 57.4% | 57.4% | Restorative Shot | https://api.deadlock-api.com/v1/builds/76/783060 |
| Apollo (77) | 467560 | SN\|P3R : ϟ Devil May Care ϟ | 34347 | 50.0% | 49.1% | Mystic Burst | https://api.deadlock-api.com/v1/builds/77/467560 |
| Deadman Danny (78) | 853350 | NA #1 JETPACK JOYRIDE - Shmuck | 52683 | 50.2% | 49.7% | Grit | https://api.deadlock-api.com/v1/builds/78/853350 |
| Rem (79) | 421857 | The World's Craziest Pillow Fight, But Crazier | 57663 | 47.1% | 45.8% | Extra Spirit | https://api.deadlock-api.com/v1/builds/79/421857 |
| Silver (80) | 762589 | Mari, Mother of [regular] Silver (ANNOTATED) | 40716 | 46.2% | 45.9% | Restorative Shot | https://api.deadlock-api.com/v1/builds/80/762589 |
| Celeste (81) | 459214 | Celeste - Spirit-DPS [59% WR] [tracklock.gg] | 119564 | 48.8% | 48.5% | Extra Regen | https://api.deadlock-api.com/v1/builds/81/459214 |
| Rat King (84) | 836523 | SN\|P3R : Rat-a-Tat ( Rat King Gun ) | 159778 | 57.5% | 56.2% | Monster Rounds | https://api.deadlock-api.com/v1/builds/84/836523 |
| Solomon (85) | 868430 | YaBoyCJ Solomon Spirit Solved V1.1 | 69014 | 46.9% | 46.1% | Extra Spirit | https://api.deadlock-api.com/v1/builds/85/868430 |
| Violet (86) | 894210 | Scribblenauts Gameplay!!! | 73438 | 52.4% | 50.8% | Restorative Shot | https://api.deadlock-api.com/v1/builds/86/894210 |
| Nurse Harrow (87) | 916079 | HARROWING MY NURSE  \| GUN + HEAL  \| L > R \| | 102281 | 52.8% | 51.4% | Restorative Shot | https://api.deadlock-api.com/v1/builds/87/916079 |
| Baba (88) | 857832 | Baba Stompa (Dr. Spooki von Spookenstein) | 1583 | 53.4% | 53.2% | Melee Lifesteal | https://api.deadlock-api.com/v1/builds/88/857832 |

## Примечания к честности данных

- Все числа взяты из ответов API, ничего не выдумано; сырые ответы сохранены в `raw/`.
- Винрейт сборки считается API-статистикой матчей, где эта сборка была выбрана игроком на старте (`hero_build_id`); часть игроков меняет сборку в процессе матча — ограничение данных API.
- Названия сборок — как в игре (язык en, `language=0`).
- Внутриигровая проверка: Магазин → Сборки → поиск по `build_id`.
- Ограничение: fetched build — последняя версия сборки на 2026-11-04; статистика — за 30 дней до этой даты.

## Сырые файлы

- `raw/openapi.json` — спецификация API
- `raw/heroes.json` — список 44 героев
- `raw/hero-stats.json` — винрейты героев
- `raw/items.json` — справочник предметов
- `raw/build-stats/{hero_id}.json` — статистика сборок каждого героя (min_matches=200, 30 дней)
- `raw/builds/{hero_id}_{build_id}.json` — полные ответы по проверенным сборкам
- `raw/selection.json` — журнал отбора (какие кандидаты проверялись и почему отклонены)
- `raw/build-search-test.json`, `raw/build-detail-test.json`, `raw/build-stats-hero1.json` — тестовые запросы
