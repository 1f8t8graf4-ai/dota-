# ОТЧЁТ-mu — «Против кого стоишь»: советы против каждого героя

**Ветка:** `zai/matchups` (от свежего main). **Статус: готово.**

## Что сделано
- **`data/matchups.json`: 44 героя, 75 советов** (по 1–3 на героя). Каждый совет растёт из текста способности: `q` — дословная цитата из текста ключа `key`, `t` — совет по-русски, `ab`/`abr` — название способности и короткий перевод.
- Источник — только файлы игры: `SteamDatabase/GameTracking-Deadlock`, `game/citadel/resource/localization/citadel_heroes/citadel_heroes_english.txt` (лежит рядом: `tools/matchups_citadel_heroes_english.txt`, 446 КБ). Связка «герой → способности» — из `game/citadel/pak01_dir/scripts/heroes.vdata` (`m_mapBoundAbilities`, слоты `ESlot_Signature_*`): у способностей свои коды (Вайолет = artist в героях, но zealot в способностях), без vdata их не связать.

## Проверки
- `python3 tools/matchups_check.py` — каждый `q` дословно есть в сыром тексте ключа (учитывая разметку `<span>`/`{g:…}` — цитаты выбраны без пересечения тегов); 1–3 совета на героя; ключ существует. **44/44, 75 советов, ошибок нет.**
- Сверено с образцами из макетов v19 (Вайолет/Still Life, Уорден/Lock Down, Леди Гайст/Life Drain, Виндикта/Stake) — советы те же по сути, формулировки живее.

## Ключи в json — коды из файлов игры, не id из games.json
`artist` = Violet, `atlas` = Abrams, `gigawatt` = Seven, `forge` = McGinnis, `chrono` = Paradox, `ghost` = Lady Geist, `hornet` = Vindicta, `krill` = Mo & Krill, `synth` = Pocket, `tengu` = Ivy, `unicorn` = Celeste, `orion` = Grey Talon, `priest` = Venator, `punkgoat` = Billy, `ratking` = Rat King, `nano` = Calico, `necro` = Graves, `nurse` = Nurse Harrow, `bookworm` = Paige, `chessmaster` = Solomon, `deadpack` = Dead Man Danny, `frank` = Victor, `familiar` = Rem, `fencer` = Apollo, `magician` = Sinclair, `vampirebat` = Mina, `viper` = Vyper, `werewolf` = Silver, `viscous` = Viscous, `drifter` = Drifter, `baba` = Baba, `bebop`, `dynamo`, `haze`, `inferno` = Infernus, `kelvin`, `lash`, `mirage`, `shiv`, `warden`, `wraith`, `yamato`, `astro` = Holliday.
Внутри каждой записи есть `n` (имя по-английски) и `ru` — маппить несложно.

## Что не вышло / «?»
- У 16 героев по одному совету (Baba, Haze, Shiv, Wraith и др.): остальной их кит не даёт прямого контрплей-факта в тексте («урон и слоу» — не совет). По правилам не выдумывала.
- **Silver/Lycan Curse** — «increased at low health» двусмысленно (чьё здоровье): совет про болу, про ярость не писала.
- Некоторые способности в файлах переименованы/новее, чем на вики (у Вайолет 3 из 4 в локализации) — брала то, что есть в файле.

## Файлы
- `data/matchups.json` — результат.
- `tools/matchups_check.py` — проверка (локализацию докачает сам, если файла нет).
- `tools/matchups_citadel_heroes_english.txt` — снапшот локализации для воспроизводимости.
