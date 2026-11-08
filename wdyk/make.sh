#!/bin/bash
# Полная сборка ролика: голос → кадры → звук → final.mp4
#   ./make.sh mrbeast [voice]   (voice — перегенерировать озвучку; без него берётся готовая out/<ep>/timeline.json)
set -e
cd "$(dirname "$0")"
ep=$1
[ "$2" = voice ] && python3 build_voice.py "$ep"
NODE_PATH=${NODE_PATH:-/opt/node-tools/node_modules} node capture.mjs "$ep" video 30 4
python3 build_audio.py "$ep"
ffmpeg -v error -y -i "out/$ep/video.mp4" -i "out/$ep/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "out/$ep/final.mp4"
echo "$ep готов: out/$ep/final.mp4"
