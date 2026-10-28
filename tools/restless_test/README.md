# Тесты Restless (сайт `restless/`)

Playwright без сборки. API `api.deadlock-api.com` идёт через `curl` (из облака открыт), картинки CDN `assets-bucket.deadlock-api.com` из облака закрыты — подменяются цветными заглушками, поэтому арт глазами не проверить.

```
python3 -m http.server 8095            # в корне репо (порт можно сменить: PORT=8096)
NODE_PATH=/opt/node-tools/node_modules node tools/restless_test/t.js pc|ph <папка скринов> [account_id] [match_id] [labs|city|clean]
```

- `t.js` — главная, профиль, матч, разбор матча (по умолчанию игрок Андрея 930626915, матч 125424790).
- `th.js` — вкладка «Герои» (сетка, тиры, страница героя).
- `tc.js` — карты героев как в Marvel Snap.
- `tg.js` — Андрей и топ-игрок: главная и разбор, только ошибки консоли.
- `tm.js` — `restless/mod.html` «Сборки в игре» (`node tm.js pc|ph <папка>`).

Проверять: консоль без ошибок (кроме `ERR_FAILED` от заглушённых картинок), страница не едет вбок, телефон 390 и ПК 1440.
