# Пульт 130 приёмов Боба

Страница: https://claude.ai/artifact/6zC9afRinD6tGydLhVQetA (клипы лежат в самой странице, в git их нет — чужое видео).

- `notes.txt` — 194 кандидата из 13 роликов `ролик|начало|конец|T/A|название|что в кадре`.
- `rate.py` — 130 отобранных: оценка 1–10, сложность E/M/H, почему, как у нас, ★ (мой совет).
- `make_clips.py` — нарезка `bob_fx_clips/fx_NNN.mp4` (±0,3 с, x264 crf 18, preset fast, без звука, GOP 12) + `fx130.json`; путь к оригиналам — `REF` в начале файла.
- `analyze.py` → `motion.json` (длина роликов, кривая движения) — нужен для `make_clips.py`.
- `thumbs2.py` — превью для каталога: самый детальный кадр внутри приёма → `thumbs.jpg` (сетка 10×13).
- `build.py` — вставляет данные в `pult.tpl.html` → `out/pult_130_bob_fx.html`.

Публикация: страница + `thumbs.jpg` + клипы частями ≤ 60 МБ (`root` = папка `out`, `files` списком) на тот же адрес.

Отметки Андрея: база страницы, коллекция `fx`, doc id = номер приёма (`001`…), поля `want` (🔥), `note`, `t`. Читать: `ArtifactData list fx`.
Клип по номеру: `Artifact read` с `path` = `bob_fx_clips/fx_NNN.mp4`.
