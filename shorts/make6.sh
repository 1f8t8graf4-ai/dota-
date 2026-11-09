#!/bin/bash
# v6: ролик целиком без голоса — звуки по событиям, музыка, видео, сведение, сжатая копия.
#   ./make6.sh nicw1-ru [nicw2-ru …]       MUSIC=трек.mp3 ./make6.sh nicw2-ru — со своей музыкой
#   Голос пришёл: python3 voice.py <ep> --audio файл.mp3 → и снова ./make6.sh <ep> (VOICE=1 — свести с голосом)
set -e
cd "$(dirname "$0")"
export NODE_PATH=${NODE_PATH:-/opt/node-tools/node_modules}
D=${DELIVER:-/home/user/wdyk/deliver4}; mkdir -p $D
for EP in "$@"; do
  node capture.mjs $EP cues 20
  if [ -n "$VOICE" ]; then python3 audio.py $EP; else NOVOICE=1 python3 audio.py $EP; fi
  node capture.mjs $EP video 30 4
  ffmpeg -y -v error -i out/$EP/video.mp4 -i out/$EP/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/$EP/final.mp4
  ffmpeg -y -v error -i out/$EP/final.mp4 -c:v libx264 -preset slow -crf 20 -maxrate 8M -bufsize 16M -pix_fmt yuv420p -c:a copy -movflags +faststart $D/$EP.mp4
  echo "$EP готово: $(du -h $D/$EP.mp4 | cut -f1)"
done
