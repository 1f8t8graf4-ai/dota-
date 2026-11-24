#!/bin/bash
# Вшить крючок (hook_<язык>_<часть>.png из tt_hook.mjs) в первые 3 с шортса: ./tt_hook.sh <папка png> <папка вывода> en|de|ru [части]
# Источник: out/<ролик>/final.mp4 (видео + звук), если нет — video.mp4 + snd/mix.wav. Текст виден с кадра 0, гаснет 2.6–3.0 с.
set -e; PNG=$1; OUT=$2; L=$3; PARTS=${4:-"1 2 3 4 5"}; O=$(cd "$(dirname "$0")/../out" && pwd); mkdir -p "$OUT"
EP=(x v170a v191s v200s v210s v220s)
for n in $PARTS; do
  case $L in en) d=${EP[$n]}-en-vo; name=EN_Part${n}_hook;; de) d=${EP[$n]}-de-vo; name=DE_Teil${n}_hook;; ru) d=${EP[$n]}-ru; name=RU_Chast${n}_hook;; esac
  if [ -f $O/$d/final.mp4 ]; then IN=(-i $O/$d/final.mp4); A=(-map 0:a -c:a copy); else IN=(-i $O/$d/video.mp4 -i $O/$d/snd/mix.wav); A=(-map 2:a -c:a aac -b:a 192k -shortest); fi
  ffmpeg -v error -y "${IN[@]:0:2}" -loop 1 -t 3 -i $PNG/hook_${L}_${n}.png "${IN[@]:2}" \
    -filter_complex "[1:v]format=rgba,fade=t=out:st=2.6:d=0.4:alpha=1[h];[0:v][h]overlay=0:0:eof_action=pass,format=yuv420p[v]" \
    -map "[v]" "${A[@]}" -c:v libx264 -preset medium -crf 20 -profile:v high -movflags +faststart $OUT/$name.mp4
  echo "$OUT/$name.mp4 $(du -m $OUT/$name.mp4 | cut -f1) МБ"
done
