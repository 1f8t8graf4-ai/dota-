#!/bin/bash
# 21.11: сжать ролик для отправки (Gemini и т. п.): l10n/squeeze.sh <in.mp4> <out.mp4> — 720×1280, два прохода x264, итог ≤ 9,6 МБ
set -e
IN=$1; OUT=$2; T=$(mktemp -d)
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
VB=$(python3 -c "print(int(9.45e6*8/$DUR - 72000))")
ffmpeg -v error -y -i "$IN" -vf scale=720:1280:flags=lanczos -c:v libx264 -preset slow -b:v $VB -pass 1 -passlogfile $T/p -an -f null /dev/null
ffmpeg -v error -y -i "$IN" -vf scale=720:1280:flags=lanczos -c:v libx264 -preset slow -b:v $VB -pass 2 -passlogfile $T/p -pix_fmt yuv420p -c:a aac -b:a 64k -movflags +faststart "$OUT"
rm -rf $T
echo "$(basename "$OUT"): $(python3 -c "import os;print(round(os.path.getsize('$OUT')/1e6,2))") МБ, видео $((VB/1000)) кбит/с, $DUR с"
