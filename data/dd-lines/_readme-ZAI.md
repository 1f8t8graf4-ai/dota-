# Реплики героев Deadlock (часть Б) — что здесь лежит

Дата: 25.10. Делал ZAI. Задание — `ДЛЯ-ZAI-задание-25.10.md`, часть Б.

## Формат

Один файл на героя: `<slug>.json` (slug в стиле `data/games.json`: rat-king, grey-talon, mo-krill...). Внутри — массив:

```json
[{"en":"Evil stirs in New York...","cat":"select","sub":null,"file":"Venator_select_01.mp3","a":"scenes/games/deadlock/v/venator/venator-evil-stirs.mp3","with":[],"sec":2.4}]
```

- `en` — текст реплики как на вики (переводов НЕТ — это за тобой);
- `cat` — раздел страницы коротко: `select`, `unselect`, `conversation`, `ability`, `generic`, `ping`, `hero-specific`, `other`, `removed`, `animintro`;
- `sub` — подраздел страницы как есть (имя способности «Scrap Grena», «Kill Enemy Hero», «Killstreak», «Shopkeeper» и т. п.), null если раздел плоский;
- `file` — исходное имя mp3 на вики;
- `a` — ключ в R2: `scenes/games/deadlock/v/<slug>/<slug>-<слова>.mp3` (mono 80 kbps);
- `with` — герои, которым реплика отвечает (раздел Conversations) или которых называет в тексте; слаги в том же стиле;
- `sec` — длительность звука.

## Порядок и статусы

Порядок обработки: сначала 5 героев с диалогами из games.json, дальше по вики (см. лог запуска). У каждого json число реплик = всё, что удалось скачать с CDN (часть файлов на CDN отсутствует — такие реплики пропущены, число ошибок в отчёте Андрею).

Заливка в R2: `scenes/games/deadlock/v/<slug>/*.mp3` — статус смотри у Андрея (нужен ключ Cloudflare, старый умер). Проверка: `curl -I https://dota.1f8t8graf4.workers.dev/m/<a>` → 200/206.

Иконки: `scenes/games/deadlock/icon-<slug>.png` (vertical с вики). У rat-king и venator иконки стояли ещё с 13.9.64 — не трогал.

## Как пересобрать героя

Качалка — `tools/dd_voice_fetch.py` (в этой же ветке):

```
python3 tools/dd_voice_fetch.py "Rat King" --upload          # с нуля + заливка
python3 tools/dd_voice_fetch.py --list heroes.txt            # пачкой
python3 tools/dd_voice_fetch.py --upload-only rat-king       # только залить готовое
```

Кэш сырых mp3 — вне репо (`dd-lines-work/raw`), качалка инкрементная. Ключ Cloudflare — файлом вне репо (спросить у Андрея).

## Что НЕ трогать

`js/app.js`, `data/games.json`, `bot/worker.js`, `main` — по заданию. Подключение реплик в приложение — за Клаудом.
