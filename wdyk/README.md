# What do you know about… — конвейер роликов (08.11.2026)

4 пробных ролика по формуле серии «Что вы знаете о…» (каналы «Что если?», 2016; разбор — `../ролики-примеры-ВСЕ-08.11.md`):

| Ролик | О чём | Длина |
|---|---|---|
| `mrbeast` | он не раздаёт деньги, он считает (до 100 000 в 2017 → 522 млн подписчиков ≈ 6 % Земли) | 61,8 с |
| `speed` | IShowSpeed спидранит планету: 20 стран за 28 дней, Роналду — финальный босс, потом космос | 64,5 с |
| `coffee` | кофе — наркотик, и он нас «вырастил»: яд от насекомых → пчёлы помнят цветок в 3 раза лучше → мы | 65,4 с |
| `duolingo` | сова — это капча: CAPTCHA → reCAPTCHA оцифровывала книги бесплатно → «смерть» совы в 2025 | 66,2 с |

Английский, вертикаль 1080×1920, 30 к/с, −14 LUFS. Длиннее минуты — для выплат TikTok Creator Rewards.

**Факты — настоящие.** Источники — в шапке `scripts.py`. Абсурдный только вывод. Про реальных людей — безобидная шутка, в описании ролика писать «parody / satire».

Видео в git не лежат (`out/` в `.gitignore`).

## Как устроено
1. **`scripts.py`** — тексты.
   - `{ПОКАЗ|как говорить}`, `*слово` — жёлтым, `!слово` — красным (как в NightFabel).
   - Ключ сцены = картинка.
2. **`build_voice.py <ep>`** — голос Kokoro `af_heart` (офлайн, Apache 2.0), скорость 0,95, время каждого слова — Vosk (`../tools/wt_vosk.py`) → `out/<ep>/voice.wav`, `timeline.json`.
3. **`stage.html` + `art.js` + `ep/<ep>.js`** — вся картинка кодом.
   - Кадр — чистая функция времени: `render(t)`.
   - Сцена: `EP.D[key](t, S, T)` рисует весь кадр. `T.c('слово')` — момент, когда слово прозвучало: на него вешаются появления (`pop`, `rise`, `stamp`).
   - Переходы между сценами (`EP.tr`): `iris`, `slide`, `slideR`, `up`, `zoom`, `wipe`, `flash`.
   - Камера всегда медленно наезжает — кадр никогда не стоит.
   - Субтитры по 1–3 слова, текущее — плашкой. Поверх всего — зерно и виньетка.
   - `art.js`: человечек `person()` (позы, рты, на коленях `kneel`), деньги, счётчик-табло, глобус, телефон, кнопки, штампы, лучи, искры.
4. **`capture.mjs <ep> shots t1,t2…`** — пробные кадры; **`capture.mjs <ep> video 30 4`** — видео, 4 вкладки параллельно (~3 мин на ролик).
5. **`build_audio.py <ep>`** — своя музыка (синтез, «загадка» в миноре; до «But did you know» тихо, после — бас и бит), «удар» на повороте, щелчки на выделенных словах, вжух на смене сцен (`../snd/kino`, CC0). Сведение — `../tools/tt_audio.py`.
6. **`make.sh <ep> [voice]`** — всё сразу → `out/<ep>/final.mp4`.

## С нуля
```bash
pip install kokoro-onnx soundfile tqdm requests cffi && pip install --no-deps vosk
# srt для vosk не собирается — заглушка srt.py в site-packages (class Subtitle, def compose)
mkdir -p models && cd models
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
curl -L "$(npm view transcribe2texts dist.tarball)" | tar xz package/vosk-model-small-en-us-0.15 && mv package/vosk-model-small-en-us-0.15 vosk-en
cd .. && ./make.sh mrbeast voice
```

## Проверка
- **Голос:** распознать `voice.wav` (Whisper) — текст должен совпасть.
  - «Siu» Kokoro читает как «see you» → пишем `Sue!`.
  - reCAPTCHA → `re CAPTCHA`.
- **Кадры:** `capture.mjs <ep> shots …` в середине каждой фразы, склейкой смотреть глазами.
- **Безопасные зоны TikTok:**
  - важное — между y 260 и 1250;
  - субтитры — 1290–1500;
  - при y > 900 не правее x 900.

## Новый ролик
- Добавь текст в `scripts.py`.
- Сделай `ep/<имя>.js` по образцу: палитра `C`, сцены `D.<ключ>`, `window.EP`.
- Тонику музыки — в `KEYS` (`build_audio.py`).
- Запусти `./make.sh <имя> voice`.
