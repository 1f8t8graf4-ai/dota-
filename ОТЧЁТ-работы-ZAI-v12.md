# ОТЧЁТ Z.ai по ТЗ-ZAI-v12-26.10 — часть 1: звуки абилок (ветка zai/sfx)

## Сделано
- **3 героя из 44: Venator, Rat King, The Doorman** — `sfx-deadlock/<hero>/<hero>-a1..4-cast|hit|boom.mp3`, манифест `sfx-deadlock/sfx.json` (формат из ТЗ: `ult`, `a[].n/cast/hit/src`).
- **18 файлов**: 12 cast (по одной на каждую абилку, все 4/4 есть) + 6 «самых громких» (Hit/Explode, где они есть на вики).
- Обработка по ТЗ: тишина срезана (порог −50 dB, начало и конец), mono 44.1 кГц, mp3 96 kbps, длительность ≤ 2.48 с (обрез с затуханием 0.15 с, запас на mp3-пэддинг, чтобы декодированная длина была ≤ 2.5).
- Громкость: пик мерял по **декодированному** mp3 итеративно — все файлы в диапазоне −1.05…−2.9 dBFS, ни один не выше −1 (проверка «пик ≤ −1 dBFS» проходит). Нюанс: `volumedetect` врёт на этих файлах (клампит в s16, а исходники с вики декодятся до +1.3 dBFS) — мерил через astats во float.
- Источник: `https://deadlock.wiki/<Hero>/Sounds`, секция Abilities; файлы через `Special:FilePath`. Все 18 ссылок `src` проверены — открываются (HEAD 200).
- Порядок абилок = `BoundAbilities` из `Data:HeroData.json`; **ult=4 подтверждён** по всем троим, порядок секций на Sounds-страницах совпал 1-в-1.
- Список «44 героя» = Data:HeroData.json без `InDevelopment`/`InHeroLabs`, минус TargetDummy и Silver (Transformed) — ровно 44.

## Замечания (не глюки, а особенности вики)
- **Doorman a2 «Doorway»**: блока «when casting» на вики нет — каст взял как «Place Door 01» (звук постановки двери = активация).
- **Rat King a4 «Rule, Ratannia!»**: файл на вики называется `charge cast delay` — это именно блок «when casting the spell».
- **Без «самого громкого» остались** (на вики нет Hit/Explosion/Impact-строк): Venator a3 (Hex-Lined Snap Trap), Rat King a3 (Royal Pestments), Rat King a4, Doorman a2, Doorman a4 (Hotel Guest).
- Имена героев-слаги: `venator`, `rat-king`, `doorman` (на вики он «The Doorman»); полный слаг-маппинг для остальных 41 готов в скрипте (`scripts/sfx_build.py` вне репо).

## Что не вышло
- Ничего. Жду слушания — после «ок» гоню остальные 41 тем же скриптом.
