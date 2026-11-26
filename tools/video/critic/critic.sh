#!/usr/bin/env bash
# Все замеры для критика одной командой: листы кадров, стоп-кадры, зоны интерфейса TikTok, площадка, громкость.
# Использование: tools/video/critic/critic.sh ролик.mp4 [папка=<ролик>_critic] [платформа=tiktok]
# Критику (свежему агенту) дают только эту папку, ролик и ТЗ — см. docs/critic.md.
set -uo pipefail
v="$1"; out="${2:-${v%.*}_critic}"; plat="${3:-tiktok}"
here="$(cd "$(dirname "$0")" && pwd)"; fs="$here/../ffmpeg-skill"
mkdir -p "$out"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$v")
echo "ролик: $v  ($dur c) → $out"

# 1. листы: весь ролик раз в 0,5 с (по 20 кадров на лист) + зоны интерфейса площадки
"$here/contact-sheet.sh" "$v" "$out/sheet_0.5s.jpg" 0.5 10 "$(python3 -c "import math;print(max(1,math.ceil($dur/0.5/10)))")" >/dev/null
python3 "$fs/look.py" "$v" --safe "$plat" --tiles 4x4 -o "$out/safe_$plat.png" --overwrite >/dev/null 2>&1 \
  && echo "зоны $plat: $out/safe_$plat.png"

# 2. каждая склейка крупно: кадры ±4 вокруг смены сцены
python3 "$fs/scenes.py" "$v" --json > "$out/scenes.json" 2>/dev/null
python3 - "$v" "$out" <<'EOF'
import json, subprocess, sys
v, out = sys.argv[1], sys.argv[2]
try:
    d = json.load(open(f'{out}/scenes.json'))
except Exception:
    sys.exit()
ts = [c.get('time', c.get('start')) for c in (d.get('cuts') or d.get('scenes') or []) if isinstance(c, dict)]
ts = [t for t in ts if isinstance(t, (int, float)) and t > 0.1][:24]
for k, t in enumerate(ts):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(t - 4 / 30, 0):.3f}', '-i', v, '-vf',
                    'scale=270:-1,tile=9x1', '-frames:v', '1', '-vsync', '0', f'{out}/cut_{k:02d}_{t:.2f}.jpg'])
print(f'склеек: {len(ts)} (кадры вокруг — cut_*.jpg)')
EOF

# 3. стоп-кадры (правило «не больше 3 одинаковых подряд») и почти замершие места (10 к/с)
python3 "$here/holds.py" "$v" | tail -1 | tee "$out/holds.txt"
"$here/frozen-time.sh" "$v" 0.35 | tail -1 | tee "$out/frozen.txt"

# 4. площадка и громкость
python3 "$fs/check.py" "$v" --platform "$plat" | tee "$out/check.txt" | tail -1
python3 "$here/../sfx_check.py" --long "$v" | tee "$out/audio.txt"
echo "готово: $out"
