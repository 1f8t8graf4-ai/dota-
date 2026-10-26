# ТЗ для Z.ai: фоны героев Deadlock — вынести с арта или нарисовать (26.10)

Код приложения и `main` не трогай. Сдаёшь в ветку `zai/hero-bg`. Ключи и токены Cloudflare тебе не нужны: в R2 зальёт Claude.

## Зачем
- В Versus и на карточке героя за видео героя нужен **фон**.
- Сейчас там фоны, нарисованные кодом в цветах гербов (макеты: https://claude.ai/artifact/4zkzTThikXJxpdx45yTmMg → «Игры» → «Фоны героев · живые»). Андрею они нравятся, но на артах у Крысиного короля и Венатора за героем уже есть своё место. Можно вынести его в отдельный фон или нарисовать по нему.
- **Как делать — решаешь сама**, по двум путям ниже. Можно попробовать оба и сдать лучший; напиши, почему выбрала его.

## Исходники
Кадры 16:9 из ветки `claude/hero-16x9`:
- `heroes-16x9/rat-king.jpg`
- `heroes-16x9/venator.jpg`

У Венатора есть и улучшенный кадр — тот, из которого Андрей делал `venator-2.mp4` (бока докрашены). Если он у тебя есть, бери его.

## Путь А — вынести фон с арта (правка картинки нейронкой)
Прикладываешь кадр и даёшь промт. Ниже два промта, проверенных на правилах наших роликов: никакой новой живности, никакого текста, середина спокойная.

### Крысиный король
```
Edit this image. Remove the Rat King and every rat completely: the big rat on the throne, the light brown rat on his back, the small white rat behind the pizza slice, all small rats on the pipes, all their tails, and the pizza slice. Keep only the place: the throne built of old iron sewer pipes, valves and bolts, the big dim red-orange round light behind it, the dark green-grey sewer haze, the pipes rising in the background. Repaint every area where a rat was as a natural continuation of the pipes, the throne and the haze, in exactly the same painted style, colors, brushstrokes and light. Turn the picture into a vertical 9:16 frame: continue the pipes upward and the dark wet sewer floor with a thin film of water downward; repaint the soft blurred sides as sharp painting. Nothing new: no characters, no animals, no faces, no eyes, no text, no logos. Keep the middle of the picture calm and slightly darker, because a character will stand there; the red-orange light and the pipe shapes stay in the upper part and at the edges.
```

### Венатор
```
Edit this image. Remove Venator completely: the man, his face, his weapons, the shotgun with the fire, the rosary, the knives on his chest, the censer and his cape. Keep only the background: the big grey circular halo behind his head with thin radiating lines like a rose window, the halftone dot pattern, the dark charcoal-purple sky and the violet paint strokes at the bottom. Repaint every area where he was as a natural continuation of the halo, the radiating lines, the dots and the paint strokes, in exactly the same painted style, colors and light. Turn the picture into a vertical 9:16 frame: the halo stays in the upper third, the paint strokes continue downward; repaint the soft blurred sides as sharp painting. Nothing new: no people, no faces, no crosses, no candles, no text, no logos. Keep the middle of the picture calm and slightly darker, because a character will stand there.
```

### Если вышло плохо
- Модель оставила кусок героя (рука, хвост, ствол) — повтори с правкой: `Remove the remaining <что осталось> too.`
- Модель дорисовала новое (людей, крыс, окна, надписи) — повтори и допиши в начало: `Do not add anything.`
- Две неудачные попытки подряд — бросай путь А и иди путём Б.

## Путь Б — нарисовать самой по мотивам арта
- Один SVG на героя, `viewBox="0 0 180 400"`, у `<svg>` стоит `preserveAspectRatio="xMidYMid slice"`.
- Файл до 6 КБ. 3–4 цвета, взятые с арта.
- Нельзя: `filter`, `blur`, `mask`, картинки внутри, текст, лица, копии арта.
- Мотив — место с арта:
  - у Крысы — трубы трона и красный круг света;
  - у Венатора — круг-нимб с лучами и точечный растр.
- Всё главное — в верхних 35 % и по краям, середина спокойная.
- Живые группы — не больше двух на фон, каждая в своей `<g class="hb-…">` (например, `hb-ray` для лучей, `hb-wv` для воды). Анимации CSS сделает Claude.

## Живость (по желанию, только для пути А)
Андрей хочет, чтобы фоны чуть-чуть двигались, «лайтовенько». Если вышла хорошая картинка, можно оживить её роликом на 8 с в Veo / Flow по правилам наших петель:
- камера стоит;
- двигается только свет и мелочь:
  - у Крысы — вода на полу течёт, по трубам медленно ползёт отблеск красного света;
  - у Венатора — лучи нимба медленно поворачиваются, точки растра мерцают;
- ничего не появляется и не пропадает, первый и последний кадр совпадают.

Петлю собирает Claude: `tools/hero_loop.py`.

## Как проверить перед сдачей
1. Открой фон на чёрном экране 360×780.
2. Закрой середину прямоугольником: 60 % ширины × 55 % высоты, снизу. Туда ляжет видео героя.
3. Видно, чей это фон, по верху и краям? Значит, годится.

## Сдача
- Ветка `zai/hero-bg`. Путь А — `games/deadlock/bg/rat-king.jpg` и `venator.jpg` (вертикаль 1080×1920, JPEG качество 85). Путь Б — `.svg` с теми же именами.
- Если оживляла — сырые ролики рядом, `…-raw.mp4`.
- Страница `games/deadlock/bg/index.html`: все варианты сеткой, подпись «путь А / путь Б» и одна строка, почему выбрала.
- В `main` не пушить.

## Остальные герои
Когда Андрей скажет. Сначала только эти двое.
