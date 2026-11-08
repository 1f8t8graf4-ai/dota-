#!/bin/bash
# Ролик целиком: ./make.sh <ep-lang> [voice]   (например ./make.sh nicotine-ru voice)
#   voice — заново озвучить (Kokoro / Piper); без него берётся out/<ep>/voice.wav и timeline.json.
#   Готовое: out/<ep>/final.mp4 и сжатая копия для отправки ../../wdyk/deliver2/<ep>.mp4 (≈ 8 Мбит/с).
set -e
cd "$(dirname "$0")"
EP=$1
export NODE_PATH=${NODE_PATH:-/opt/node-tools/node_modules}
if [ "$2" = voice ]; then case $EP in *-ru) SV_LEN=1.1 python3 voice.py $EP ;; *) python3 voice.py $EP ;; esac; fi
python3 audio.py $EP
node capture.mjs $EP video 30 4
ffmpeg -y -v error -i out/$EP/video.mp4 -i out/$EP/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/$EP/final.mp4
D=${DELIVER:-/home/user/wdyk/deliver2}; mkdir -p $D
ffmpeg -y -v error -i out/$EP/final.mp4 -c:v libx264 -preset slow -crf 21 -maxrate 8M -bufsize 16M -pix_fmt yuv420p -c:a copy -movflags +faststart $D/$EP.mp4
echo "$EP готово: $(du -h $D/$EP.mp4 | cut -f1)"
