#!/usr/bin/env python3
"""Проверка learn/dd-chapters.jsonl — ключевые слова глав комиксов (ТЗ-ZAI-v12 часть 5).

python3 tools/check_dd_chapters.py
Выход 1, если есть ошибки. Формат строки:
{"dlg":"<hero>-<N>","kw":[{"t":"...","m":"...","lv":"B1","line":2}, ...]}
t — дословно из реплики с номером line (1-based), m — значение в этой реплике,
lv — A1…C1, на главу 8–14 kw (меньше — предупреждение: короткая глава).
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LV = {"A1", "A2", "B1", "B2", "C1"}
BAD_RU = re.compile(r'[;/()\[\]]|[A-Za-z]')


def norm(t):
    t = t.replace("’", "'").replace("‘", "'").lower()
    t = t.replace("'", "")  # don't/somethin'/name's — сравниваем без апострофов
    t = re.sub(r"[^a-z ]+", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def found(x, text):
    x, text = norm(x).rstrip("?.!,'"), norm(text)
    return re.search(r"(?<![a-z'])" + re.escape(x) + r"(?![a-z'])", text) is not None


def main():
    G = json.load(open(os.path.join(ROOT, "data/games.json"), encoding="utf-8"))["GAMES"]["deadlock"]
    dialogs = {}
    for h in G["heroes"]:
        for i, dlg in enumerate(h["dialogs"], 1):
            dialogs[f"{h['id']}-{i}"] = dlg["lines"]

    E, Wn = [], []
    seen_dlg = set()
    total = 0
    for ln, raw in enumerate(open(os.path.join(ROOT, "learn/dd-chapters.jsonl"), encoding="utf-8"), 1):
        if not raw.strip():
            continue
        at = f"dd-chapters.jsonl:{ln}"
        try:
            o = json.loads(raw)
        except Exception as e:  # noqa: BLE001
            E.append(f"{at}: не JSON ({e})")
            continue
        dlg = o.get("dlg", "")
        if dlg not in dialogs:
            E.append(f"{at}: нет такого диалога {dlg}")
            continue
        if dlg in seen_dlg:
            E.append(f"{at}: {dlg} второй раз")
        seen_dlg.add(dlg)
        lines = dialogs[dlg]
        kw = o.get("kw")
        if not isinstance(kw, list) or not kw:
            E.append(f"{at}: {dlg} — kw пустой")
            continue
        if len(kw) > 14:
            E.append(f"{at}: {dlg} — kw больше 14 ({len(kw)})")
        if len(kw) < 8:
            Wn.append(f"{at}: {dlg} — kw меньше 8 ({len(kw)}): короткая глава?")
        tt = set()
        for it in kw:
            total += 1
            t, m, lv, n = it.get("t", ""), it.get("m", ""), it.get("lv", ""), it.get("line")
            tag = f"{at}: {dlg} «{t}»"
            if lv not in LV:
                E.append(f"{tag} — lv «{lv}» не из {sorted(LV)}")
            if not isinstance(n, int) or not (1 <= n <= len(lines)):
                E.append(f"{tag} — line {n} вне диапазона 1..{len(lines)}")
                continue
            text = lines[n - 1]["en"]
            if not t or not found(t, text):
                E.append(f"{tag} — t нет дословно в реплике {n}: «{text[:60]}»")
            if not m or BAD_RU.search(m):
                E.append(f"{tag} — m пустой или с латиницей/скобками: «{m}»")
            if len(m) > 42:
                Wn.append(f"{tag} — m длинный ({len(m)})")
            if t.lower() in tt:
                E.append(f"{tag} — повтор внутри главы")
            tt.add(t.lower())

    missing = sorted(set(dialogs) - seen_dlg)
    if missing:
        E.append(f"нет строк для {len(missing)} диалогов: {', '.join(missing)}")
    print(f"Диалогов: {len(seen_dlg)}/{len(dialogs)}; kw всего: {total}")
    for x in Wn:
        print("W:", x)
    for x in E:
        print("E:", x)
    print("Ошибок:", len(E), "| предупреждений:", len(Wn))
    sys.exit(1 if E else 0)


if __name__ == "__main__":
    main()
