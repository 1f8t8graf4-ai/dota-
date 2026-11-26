# tools/video — шпаргалка конвейера роликов

Всё работает в облаке без установки: Python 3 + numpy + ffmpeg 6.

## Проверка готового ролика

| Задача | Команда |
|---|---|
| Всё сразу для критика (≈ 25 с) | `tools/video/critic/critic.sh ролик.mp4 [папка] [tiktok]` |
| Требования площадки (PASS / WARN / FAIL) | `python3 tools/video/ffmpeg-skill/check.py ролик.mp4 --platform tiktok` |
| Что закрывает интерфейс TikTok | `python3 tools/video/ffmpeg-skill/look.py ролик.mp4 --safe tiktok --tiles 4x4 -o safe.png` |
| Один кадр крупно | `python3 tools/video/ffmpeg-skill/look.py ролик.mp4 --at 7.2` |
| Стоп-кадры больше 3 одинаковых подряд | `python3 tools/video/critic/holds.py ролик.mp4` |
| Почти замершие места | `tools/video/critic/frozen-time.sh ролик.mp4` |
| Лист кадров | `tools/video/critic/contact-sheet.sh ролик.mp4 out.jpg 0.5 10 4` |
| Громкость (замер) | `python3 tools/video/ffmpeg-skill/loudness.py ролик.mp4 --measure-only` |

Как работает критик — `docs/critic.md`. Приёмы картинки — `docs/visual_patterns.md`.

## Звук

| Задача | Команда |
|---|---|
| Скачать звуки (Openverse, CC0 / CC BY) | `python3 tools/video/sfx_fetch.py latch "door latch" 3 --max 1.5` |
| Что лежит в библиотеке и чьё | `python3 tools/video/sfx_fetch.py --list` |
| Проверить звуки | `python3 tools/video/sfx_check.py sfx/` |
| Проверить голос / микс | `python3 tools/video/sfx_check.py --long mix.wav` |
| Отбраковка (гул, шип, длина) | `python3 tools/video/critic/sfx-candidates.py sfx/latch/*` |
| Свести голос + звуки + музыку | `python3 tools/video/sfx_mix.py --voice v.wav --cues cues.json --music bed.wav --out mix.wav` |
| Вырезать паузы из голоса | `python3 tools/video/ffmpeg-skill/silence.py voice.wav --list` |
| Нормализовать до −14 LUFS | `python3 tools/video/ffmpeg-skill/loudness.py ролик.mp4` |

**Библиотека:** `sfx/<id>/*.mp3` + `sfx/LICENSES.json`.
- У каждого файла — автор, лицензия, ссылка и строка подписи.
- CC BY — подпись в описание ролика.
- Без ключа Openverse даёт 1000 запросов в день на весь адрес облака, лимит общий; кончился — скрипт скажет, через сколько.

**cues.json** — `[{"t": 16.42, "id": "latch", "db": -4}]`, или в командной строке `--cue latch@16.42:-4`.
- Тишина в начале звука срезается сама — звук ударяет ровно в `t`.
- Громкость каждого звука выравнивается.
- Одинаковые `id` берут разные варианты по кругу.

**Как сводит:**
- звуки и музыка приседают под голос через sidechaincompress; порог подбирается сам — под речью ровно на `--duck` дБ (по умолчанию 14), в паузах — 0 дБ;
- в конце — усиление + лимитер до −14 LUFS, true peak ≤ −1 dBTP.

## Картинка и монтаж (ffmpeg-skill)

| Задача | Команда |
|---|---|
| Под 9:16 с размытым фоном | `python3 tools/video/ffmpeg-skill/fit.py in.mp4 --aspect 9:16 --fit blur` |
| Обрезать до N секунд | `python3 tools/video/ffmpeg-skill/fit.py in.mp4 --duration 59 --method trim` |
| Субтитры из .srt / караоке | `python3 tools/video/ffmpeg-skill/caption.py in.mp4 --srt subs.srt` |
| Склейки и громкие места | `python3 tools/video/ffmpeg-skill/scenes.py in.mp4 --json` |
| Перекодировать для площадки | `python3 tools/video/ffmpeg-skill/export.py in.mp4 --help` |
| Все 47 скриптов | `tools/video/ffmpeg-skill/_ref/scripts.md`, у каждого `--help` |

Общие флаги ffmpeg-skill:
- `--dry-run` — показать команду, ничего не писать;
- `--json` — ответ для скриптов;
- `--overwrite` — без него существующий файл не перезапишется.

## Найдено на первом прогоне (26.11, Духless)

- **Цвет.** Наши рендеры помечены как BT.601 (`bt470bg`), а для HD нужен BT.709. На части плееров цвета немного другие.
  - Лечится при кодировании: `-vf scale=out_color_matrix=bt709 -colorspace bt709 -color_primaries bt709 -color_trc bt709`.
  - Духless не трогали — для следующих роликов.
- **HUD.** Строка сверху (y ≈ 30 из 1920) — в зоне, которую закрывает интерфейс TikTok. Для TikTok опускать ниже 10 % высоты.
- **Склейка.** Субтитр иногда переезжает через склейку на следующую картинку.

## Откуда что

- `ffmpeg-skill/` — копия scripts из kajisho5/ffmpeg-skill (MIT), коммит в `ffmpeg-skill/SOURCE.md`.
- `critic/frozen-time.sh`, `contact-sheet.sh`, `sfx-candidates.py` — из echris6/motion-video-kit (MIT), `critic/SOURCE.md`.
- Остальное наше.
