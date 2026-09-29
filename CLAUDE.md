# CLAUDE.md

Telegram mini app + bot for learning **English or German** through games (Dota 2, CS 2), films and series, plus party games. UI and all user-facing text are in **Russian**. Full history, rules and roadmap: `README.md` (read it before big changes).

## The author
Not a programmer. Answer in Russian, short and direct. Give **whole files**, never snippets to paste. Put the version in file names when a file is copied by hand (e.g. `worker-4.6.js`). Explain uploads click by click.

## Layout (no build step — the files in this repo are the source of truth)
- `index.html` — markup + loader. Sets `window.ASSET_BASE` (where scene videos live), fetches `data/*.json` into `window.__DATA`, then loads `js/app.js?v=<V>`. **Bump `V` on every release** or Telegram serves cached JS.
- `js/app.js` — all logic (~210 KB), sections separated by `/* ================= name ================= */`. Order: icons → modes/roles/ranks → storage → Telegram → sound → question builders (`BUILD`) → session (`startSession`, `finish` = one answer, `renderEnd` = end of game) → tips/new question kinds/spaced review → tabs (`renderTab`: learn, kino, games, profile; `spy`/`arena` are sub-pages of games) → dictionary → onboarding quiz → settings → spy → tournament → scenes (`renderScene`, `renderScEp`, `renderScQuiz`, player `scVideo`) → memory tips (`MEM`, `memOf`) → CS 2 words → worlds (`setWorld`, `renderDotaWorld`, `renderCSWorld`, `renderWiki`, `startLesson`) → card duel (`cg*`, `cgPick`, `cgStart`, `cgAiTurn`, evolution `cgEvolve`, dig `cgDiscover`, voice `cgVoice`) → section flags / admin panel (`flagOf`, `applyFlagsUI`, `renderAdmin`, server `POST /api/flags`, D1 table `appflags`).
- `styles/main.css` — all styles. Themes by world: `t-clean` neutral (default), `t-hud` Dota, `t-cs` CS 2, scenes `.scn.noir` / `.scn.bone`, card duel `body[data-world=cards]`.
- `data/*.json` — **data only, no functions**: `icons`, `dota` (TERMS, ITEMS, BUILDS, SKILLS, HEROES, HERO_POS), `words` (WORDS, PHRASES), `lore-vocab`, `tips` (TIPS, MEM), `spy`, `scenes` (SCENES: parts, subtitle rows `[start, end, en, ru, de]`, study phrases).
- `lore.json` — official item/skill lore, rebuilt weekly by `.github/workflows/main.yml` → `tools/build-lore.mjs`.
- `bot/worker-*.js` — Cloudflare Worker (bot webhook + API `/api/spy`, `/api/tour`, `/api/flags`), D1 database `DB`. Pasted into Cloudflare by hand. Secrets only in Cloudflare variables (`BOT_TOKEN`, `WEBHOOK_SECRET`, `ADMIN_ID`) — **never commit tokens**.
- Scene videos live in a separate repo `scenes` (GitHub Pages): keys `scenes/<scene-id>/<NN>.mp4|jpg`, `scenes/<scene-id>/cover.jpg`. Code builds URLs only via `assetUrl(key)`.

## Rules
- Never rewrite from scratch; make targeted edits. A past rewrite broke everything.
- Do not change storage keys (`dota_quiz_v4`, `dota_m_v1`, `dota_r_v1`, `dota_sc_v1`) or word/scene ids without a migration — players lose progress.
- One learning language at a time (`store.langs[0]` is `en` or `de`).
- Worker API: every request carries `x-init-data` (Telegram initData), verified with HMAC before use.
- Content: useful words, no gamer slang in learning material; German nouns with article.
- Card duel characters are shown with names and monograms only — no character or actor artwork.

## Run and check locally
- `python3 -m http.server 8765` in the repo root → open `http://localhost:8765/` (fetching `data/*.json` needs a server, not `file://`).
- Before shipping, check: every question has 4 distinct options and a correct one, no `undefined` in UI, a session reaches the end screen, spy online works with 2+ players, card duel games finish, no console errors. The author's previous test harness used jsdom and Playwright; there is no test suite in this repo yet (see README → «План на 5.0»).

## Claude Code tips
Use `/opusplan` (Opus plans, Sonnet edits). For big features: plan first, then small commits.
