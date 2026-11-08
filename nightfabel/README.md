# NightFabel — конвейер роликов (08.11.2026)

Первый ролик: **«You just took one hit of weed»** — научпоп, английский, 1:19, 1080×1920.
Сам ролик в git не лежит (14 МБ), Андрею отправлен файлом.

Про каналы и аккаунты — файл `NightFabel-для-Claude.md` у Андрея.

---

## Как устроено
1. **`script.py`** — текст по сценам.
   - `{ПОКАЗ|как говорить}` — на экране одно, в озвучке другое: `{4%|four percent}`.
   - `*слово` — жёлтым, `!слово` — красным.
   - Вверху файла — источники фактов. **Факты — только проверенные.**
2. **`build_voice.py`** — озвучка Kokoro и время каждого слова → `out/voice.wav`, `out/timeline.json`.
   - Kokoro работает офлайн, бесплатно, лицензия Apache 2.0, голос `af_heart`.
   - Время слов — Vosk (`../tools/wt_vosk.py`).
   - Переменные: `NF_VOICE`, `NF_SPEED` (первый ролик — 1.12).
3. **`stage.html`** — вся графика кодом, функция `render(t)`, кадр — чистая функция времени:
   - сова-рассказчица (клюв двигается по громкости голоса);
   - сцены `D.<сцена>`, каждая анимация привязана к слову (`cueOf`);
   - субтитры по 1–3 слова, текущее слово — плашкой;
   - ярлык сцены, источник внизу.
4. **`capture.mjs`** — Playwright снимает кадры и отдаёт их в ffmpeg.
   - `node capture.mjs shots 1.5,10,20` — пробные кадры в `shots/`;
   - `node capture.mjs video out/video.mp4 30` — всё видео, около 2 минут.
5. **`build_audio.py`** — музыка и эффекты, потом сведение:
   - музыка своя, синтез: пэд, бас, электропиано, барабаны — чужих прав нет;
   - эффекты из `../snd/kino` (наши, CC0): вжух на смену сцены, щелчки появлений, часы, сердце в такт картинке;
   - сведение — `../tools/tt_audio.py`: голос сжат, музыка на 17 дБ ниже голоса и проседает под него, итог −14 LUFS.

## Запуск с нуля
```bash
pip install kokoro-onnx soundfile tqdm requests cffi && pip install --no-deps vosk
#   vosk без srt: заглушка srt.py в site-packages (compose, Subtitle)
mkdir -p models && cd models
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
#   Vosk small en — из npm-пакета transcribe2texts → models/vosk-en
cd ..
NF_SPEED=1.12 python3 build_voice.py
NODE_PATH=/opt/node-tools/node_modules node capture.mjs video out/video.mp4 30
python3 build_audio.py
ffmpeg -i out/video.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart final.mp4
```

## Проверка
- **Произношение и разборчивость:** Whisper (`faster-whisper small.en`) по `out/voice.wav` и по готовому ролику — текст должен совпасть со сценарием.
  - PyAV не той версии: звук подавать массивом numpy через ffmpeg.
- **Кадры глазами:** `capture.mjs shots` в середине каждой фразы.
- **Безопасные зоны TikTok и Shorts:**
  - важное — между y 230 и 1480;
  - при y > 900 — не правее x 900 (там кнопки площадок).

## Новый ролик
- Свой `script.py` и свои сцены `D.*` в `stage.html`.
- Сова, фон, субтитры, звук и сборка — общие.

**Шрифты** Poppins и Nunito — SIL Open Font License (взяты из npm `@fontsource`).
