# NOTES — времена карты dl_midtown (Deadlock), прогон 2026-11-04 (перезапуск, урезанный)

## Что подтверждено (sure=1, файлы игры)

### bridge_buff — пауэрап на мосту ✅
- `game/citadel/scripts/misc.vdata` → `citadel_item_powerup_spawner`:
  - `m_flInitialSpawnTime = 300`
  - `m_flSpawnInterval = 300`
- Итог: **первый на 5:00, дальше каждые 5:00, «по часам»**. Совпало с ожиданием (5:00 / каждые 5:00).
- Тестовые ключи рядом: `m_flInitialSpawnTimeTest = 1.0`, `m_flRespawnTimeTest = 10.0` (не матч-тайминги).
- Отдельный класс `citadel_item_powerup_spawner_bounty_runes` (руна душ): `m_flInitialSpawnTime = -1`, `m_flRespawnTime = 9999999` — живёт вне цикла.

### crates — ящики/статуи (breakables) ✅
- `misc.vdata` → `citadel_breakable_prop_drop_powerups`: `m_flInitialSpawnTime = 180.0`, `m_flRespawnTime = 180.0`, `m_flPowerupDropChance = 50.0`.
- `generic_data.vdata` → `m_BreakableSpawnTimeDesc` (4 тира):
  `{180/180}, {300/300}, {600/180}, {300/180}` (initial/respawn, сек).
- Итог: **базовый тир — 3:00 и далее +180 с, «по часам»**; старшие тиры 5:00 и 10:00 (600), тоже с интервалом 180. Совпало с ожиданием (3:00, +180 с).

## Что НЕ нашлось в vdata (sure=0, не выдумывать)

### urn (урна/idol)
- Таймингов спавна нет. Только: `misc.vdata` → `citadel_item_pickup_idol` (класс), `modifier_citadel_idol_walkback: m_flWaitTimeLimit = 180.0` (таймаут «возврата» урны), `generic_data.vdata` → `m_IdolParams` (`m_flIdolDropDuration = 12.5`, `m_flIdolDropHeight = 1400`, звуки `Soul.Urn.Spawn`).
- 10:00 и правило «от сдачи» — НЕ подтверждено, в JSON null.

### koth / разлом (Midtown Boss)
- `misc.vdata` → `citadel_item_koth_spawner` без единого числового тайминга; `generic_data.vdata` → `m_KothParams` только `m_flKothRadius = 20.0` + партиклы/звуки (`Koth.Pre.Spawn.Lp`, `Koth.Spawn.Start`).
- 12:20 / окно захвата / период 7:00 — НЕ подтверждено.

### camps (лагеря крипов)
- `misc.vdata` подключает `_include: resource_name:"scripts/misc/neutral_camps.vdata_inc"`, но этого файла **нет в репо GameTracking** (raw → 404, лежит заглушка `raw/neutral_camps.vdata_inc` = "404: Not Found").
- В `generic_data.vdata` только UI: `m_flNeutralCampRespawnTimerShowDistance = 15.0`, `m_flNeutralCampRespawnTimerHeight = 2.5`.
- 1:25 / 4:50 / 5:35 — НЕ подтверждено. Вероятно, спавны лагерей задаются в энтити карты (vmap), а не в скриптах.

## Процесс/ограничения прогона
- GitHub REST API: **rate limit exceeded** (аноним) — список каталога `scripts/` и `scripts/misc/` получить не удалось; работали только `raw.githubusercontent.com` (misc.vdata 185 KB, generic_data.vdata 47.5 KB, npc_units.vdata 455 KB — скачаны ранее/сохранены в `raw/`).
- `*.vdata_inc` (neutral_camps, pickups, capture_points) → 404 в репо.
- Внешние веб-поиски (DuckDuckGo, deadlock.fandom.com API, github.com HTML) — **заблокированы исходящим прокси песочницы** (пустые ответы), поэтому sure=0-пункты остались без вики-URL. Запросы, которые стоило сделать: `deadlock urn spawn time`, `deadlock midpoint boss koth spawn`, `deadlock jungle camp respawn 4:50`.
- git не использовался, токены не трогались.

## Что дальше (next actions)
1. С не-разогретого IP: повторить `api.github.com/repos/SteamDatabase/GameTracking-Deadlock/contents/game/citadel/scripts` — проверить, есть ли `*.vdata_inc` под другими именами.
2. Взять из клиента игры `neutral_camps.vdata_inc` и данные энтити карты `dl_midtown` (спавны urn/koth/лагерей задаются, вероятно, на уровне карты) → поднять sure до 1.
3. Веб-проверка урны (10:00?), koth (12:20/7:00?) и лагерей (1:25/4:50/5:35) — сейчас sure=0.
