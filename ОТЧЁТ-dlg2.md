# ОТЧЁТ-dlg2 — диалоги второй волны

**Версия:** код приложения не трогал (ветка данных: `data/games-dialogs2.json`, `heroes-voice/`).
**Сделал:**
1. Собрал с вики все обмены (Conversations) между 10 героями (Haze, Lady Geist, Infernus, Abrams, Wraith, Mo & Krill, Pocket, Paradox, Lash, McGinnis) — между собой и с девяткой: 80 пар-источников.
2. Важная находка: в сырых данных поле `with` — не спикер, а пометка «разговор с партнёром». Настоящий спикер закодирован в префиксе mp3 (Atlas_ = Abrams, Priest_ = Venator, Ghost_ = Lady Geist…). Спикеров ставил по префиксу файла и проверял, что в каждой паре говорят ровно двое и реплики сходятся по смыслу. Заглушки вики («Yes» с файлом полного разговора) отброшены.
3. Итог: **73 диалога, 253 реплики** по 53 парам (25 пар пустые — у них на вики реплики только с одной стороны, обмен собрать нельзя; список в конце). 25 пар-дублей с обеих страниц героев схлопнуты (оставлена версия с алфавитно-первой страницы), повторы содержимого убраны.
4. Формат как у dialogs в games-new.json: {ctx, about, use, hook, hook_why, lines[{s, en, ru, a}], vocab[{w, r}]}. s — имя героя как в девятке («Grey Talon», «Mo & Krill»). about — одно предложение по-русски; vocab — 2–4 выражения из реплик.
5. mp3 каждой реплики скачан с cdn.deadlock.wiki, mono 80 кбит/с → `heroes-voice/<id>/<id>-d<NN>.mp3` (253 файла, ffprobe без странностей). `a` = `scenes/games/deadlock/v/<id>-d<NN>.mp3`, у одинаковых реплик (например, три «Не-а» Селесты) — общий файл.
6. `tools/upload-queue-dlg2.json` — очередь заливки на 253 позиции.

**Проверил:** каждая en дословно из своего источника (скрипт); спикеры чередуются; диалоги 2–8 реплик; 253/253 mp3 скачались; каждое слово vocab реально встречается в репликах диалога.

**Не сделал / не проверял:** заливку в R2 — нет ключа (см. ОТЧЁТ-lines35): до заливки ссылки `a` 404, заливка одной командой по очереди. Вычитку переводов вторым взглядом не делал.

**Риск:** нулевой для игроков — данные не подключены; Клауд подключит после заливки.

**Пустые пары (односторонние на вики):** abrams__rat-king, deadman-danny__lady-geist, doorman__infernus, doorman__mcginnis, doorman__seven, grey-talon__infernus, grey-talon__lady-geist, grey-talon__lash, haze__pocket, lady-geist__venator, lash__grey-talon, mcginnis__grey-talon, mo-krill__celeste, mo-krill__paradox, mo-krill__pocket, mo-krill__rem, mo-krill__victor, pocket__haze, rat-king__abrams, rat-king__haze, rat-king__rem, rem__rat-king, venator__grey-talon, venator__lady-geist, victor__abrams.
