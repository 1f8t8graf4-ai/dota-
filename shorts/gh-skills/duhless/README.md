# «Духless» EN — A/B: только готовые GitHub-скиллы (26.11)

Песочница `exp/github-skills-only`. Старые 4 варианта, рабочая ветка и `exp/pipeline-upgrade` не тронуты.
Озвучка — та же (Brock ×1,10 без «Imagine this»), всё остальное — из скиллов ниже.

## Что из какого скилла

| Скилл (GitHub) | ★ | Что дал в ролике |
|---|---|---|
| lemomo-ai/lemo-opuscar — стиль «60s Spy Title Sequence» | 21,3k | Весь вид: бумага, 4 краски, неровный край ножниц, силуэты профилем, титры как декорации, склейки на ударах меди, стоп-время в тишине, разрез кадра на косые полосы, субтитры на бумажной полоске. Движок рендера (`core/render/video.mjs`, Playwright + canvas), сэмплер с настоящими инструментами (`core/audio/sampler.py`), синтез фоли (`core/audio/sfx.py`). Код модулей демо (MIT) — `paper9.js`, `glyph9.js`, `chars9.js`, переложены в 1080×1920. |
| alchaincyf/huashu-art-motion — грамматика y5 «кинетическая типографика» | 7,7k | Главное слово «падает» 1,7→1 пружиной, цифры выскакивают с перелётом, второстепенное поднимается из прорези. Одна сцена — один фокус, каждая глава — свой цвет фона. |
| emilkowalski/skills — choreograph | 59,7k | Один ведущий элемент на удар; задержки и высоты неравные (буквы MOSCOW, нули, буквы титра). |
| bangtutorial/bang-motion | 3,1k | «Видео, а не слайды»: двигается мир и камера, не больше двух уровней текста в кадре. |
| nextlevelbuilder/ui-ux-pro-max-skill | 154k | Палитра «Luxury/Premium»: чёрный #1C1917 + золото #CA8A04 (вместе с бумагой и красным lemo — 4 краски). |
| rough-stuff/rough (Rough.js 4.6.6) | 21,5k | Рисованная подпись на договоре. |
| kajisho5/ffmpeg-skill | 11,2k | Громкость −14 LUFS (`loudness.py`), проверка TikTok (`check.py`), зоны интерфейса (`look.py --safe tiktok`). |
| echris6/motion-video-kit | 1,5k | Критик: лист кадров, замершие места (`critic.sh`). |

Поставлены, но в кадр не пошли:
- **canvas-design** — делает статичные постеры;
- **claude-drawing-skill**, **claudedraw** — их живопись и каракули спорят со стилем вырезанной бумаги;
- **line-art-animation** — TypeScript со сборкой;
- **pixelfx** — пиксель-арт, не подходит к бумаге;
- **rembg** — работает (проверено: вырезка за 2 с), но люди тут — силуэты стиля.

## Как пересобрать

Ассеты в git не лежат. Нужны библиотека lemo в `~/lemo-opuscar` (установка ниже) и голос `voice_cut.wav`.

```bash
export LIB=~/lemo-opuscar F=shorts/gh-skills/duhless
cd $LIB && node core/render/events.mjs /home/user/dota-/$F --size 1080x1920           # события кадра → events.json
$LIB/.venv/bin/python /home/user/dota-/$F/score.py                                    # музыка (VSCO 2 CE) → out/score.wav
$LIB/.venv/bin/python /home/user/dota-/$F/mix.py voice_cut.wav                        # фоли + голос «через плёнку» + музыка → out/mix.wav
node core/render/video.mjs /home/user/dota-/$F --fps 24 --workers 4 --size 1080x1920 --out /home/user/dota-/$F/out/video.mp4   # ≈ 33 с
```

Сборка — mux.sh lemo требует ffmpeg 7, у нас 6.1, поэтому вручную:
- цвет BT.709;
- зерно 6 — по правилу стиля;
- −14 LUFS — ffmpeg-skill.

Как в `out/` — команды в истории коммита.

## Установка, которую сделал (вне репо) и полный откат

- Библиотека: `~/lemo-opuscar` — клон, `.venv`, сэмплы VSCO 2 CE ~414 МБ, ссылка на playwright-core.
- Скиллы: `~/.claude/skills/`:
  - lemo-opuscar, business-motion-film (motion-video-kit), ffmpeg-skill, canvas-design;
  - claude-drawing, claudedraw, line-art-animation;
  - emil-animate, emil-choreograph, emil-design-eng;
  - ui-ux-pro-max, bang-motion, pixelfx, huashu-art-motion.
- rembg: `~/.venvs/rembg`, модель `~/.rembg/models/u2netp`.

```bash
rm -rf ~/lemo-opuscar ~/.venvs/rembg ~/.rembg
```

```bash
cd ~/.claude/skills && rm -rf lemo-opuscar business-motion-film ffmpeg-skill canvas-design claude-drawing claudedraw line-art-animation emil-animate emil-choreograph emil-design-eng ui-ux-pro-max bang-motion pixelfx huashu-art-motion
```

```bash
cd /home/user/dota- && git checkout claude/brave-brown-mf8uq9 && git branch -D exp/github-skills-only && git push origin --delete exp/github-skills-only
```
