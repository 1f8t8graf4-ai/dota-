# Restless Overlay — программа поверх Deadlock

Маленькое окно с панелью матча (наш сайт `?ov=1#ov`) всегда поверх игры — как Porofessor.

- Запустил Deadlock — окно показывается само, закрыл игру — прячется.
- **Alt+R** — показать / скрыть. **Ctrl+Alt+R** — клики проходят сквозь окно в игру.
- Значок в трее (у часов) — меню: показать, «сквозь окно», открыть сайт, выйти.
- Игру поставить в режим **«Оконный без рамки»** — поверх полноэкранного режима Windows окна не рисует.
- Первый запуск: найди себя в поиске в окне — программа запомнит.

## Сборка
Собирает GitHub Actions (`.github/workflows/restless-app.yml`) на Windows при изменениях в `restless/app/` и кладёт в релиз
`overlay-latest`: https://github.com/1f8t8graf4-ai/dota-/releases/download/overlay-latest/Restless-Overlay.exe

Руками: `npm install && npm run dist` (на Windows) → `dist/Restless-Overlay.exe`.

Программа без подписи — Windows при первом запуске покажет «Windows защитила компьютер» → «Подробнее» → «Выполнить в любом случае».
