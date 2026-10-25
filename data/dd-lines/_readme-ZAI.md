# Реплики героев Deadlock — что здесь лежит (обновлено по ТЗ-ZAI-реплики-25.10)

Делал ZAI, 25.10. Основная сдача — `data/games-new.json` + mp3 в `heroes-voice/<hero>/`.

## Главное: data/games-new.json

Формат как в `data/games.json` (Клауд проверит переводы, зальёт mp3 в R2 и вольёт):

- `dialogs` — 12 новых диалогов между девяткой героев (пары только из списка ТЗ):
  {ctx, about, use, hook, hook_why, lines[{s, en, ru, a}], vocab[{w, r}]}
  — `ru` живой русский, мат как в оригинале; `hook` — залипательность 1–5 (+ `hook_why` — почему);
  - `a` = будущий ключ R2: `scenes/games/deadlock/v/<hero>-<NN>.mp3` (латиница, без пробелов/апострофов).
- `heroes` — по 10–15 фраз на каждого из 9 героев: поле `lines` у героя:
  [{en, ru, tag(подкол|угроза|приветствие|идиома|шутка), use, a}]
- Дормен отдельно: 12 обычных фраз + **все 160 реплик ульты/портье** (`tag:"ult"`) — это набор для голоса-ведущего.
- id героев в стиле games.json: venator, rat-king, rem, grey-talon, celeste, doorman, seven, deadman-danny, victor.

Итого: 12 диалогов (66 реплик), 135 обычных фраз, 160 ультовых; mp3 — 357 файлов, 29,5 мин, mono 80 kbps.

## Аудио

`heroes-voice/<hero>/<hero>-<NN>.mp3` — пережато из оригиналов вики (mono, ~80 кбит/с).
Клауду при заливке в R2: файл `heroes-voice/<hero>/<файл>` → ключ `a` из json (имена уже совпадают: `<hero>-<NN>.mp3`).

## Про Венатор ↔ Крысиный король

На вики обменов между ними больше НЕТ: все три существующих диалога уже в `data/games.json` (13.9.64), новых строк с mp3 на обеих страницах не осталось (проверено по префиксам аудиофайлов Priest_/Ratking_). Новых Ven↔RK — 0.

## Папка data/dd-lines/ (сырьё)

Полные дампы реплик (текст+файл+раздел) по 24 героям — источник для будущих подборок (Андрей добавит героев — докачаем). Это НЕ сдача, сдача — games-new.json. Формат дампов описан в `_readme` предыдущей ревизии (git history).

## Скрипты (пересобрать/продолжить)

- `tools/dd_voice_fetch.py` — дамп всех реплик героя (текст+mp3, кэш);
- `tools/dd_dialogs.py` — разбор таблиц разговоров (кто говорит — по кодовому префиксу аудио: Priest=Venator, Ratking=Rat King, Familiar=Rem, Orion=Grey Talon, Unicorn=Celeste, Doorman, Gigawatt=Seven, Deadpack=Danny, Frank=Victor);
- `tools/dd_pairs.py` — сборка парных обменов;
- `tools/dd_build_games.py` + `tools/dd_data_*.py` — сборка games-new.json из выборки с переводами.
