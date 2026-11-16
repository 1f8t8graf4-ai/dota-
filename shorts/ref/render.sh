#!/bin/bash
# Рендер выпуска 2: ./ref/render.sh <версия, напр. v184> <трек.mp3> <папка-выхода>
# Перед этим: голос и таймлайн уже лежат в out/<v>s-ru/ и out/<v>y-ru/ (копии из прошлой версии), tl/<v>s-ru.json, tl/<v>y-ru.json, строка в stage.html.
set -e
cd "$(dirname "$0")/.."
V=$1; TR=$2; OUT=${3:-/tmp/ep2}; mkdir -p "$OUT/s" "$OUT/y"
cat ep/$V/*.js > ep/$V.js && node -e "new Function(require('fs').readFileSync('ep/$V.js','utf8'))"
node capture.mjs ${V}s-ru video 30 6 2>&1 | tail -2
RANGE='82.9-96.35' OUTF=end.mp4 node capture.mjs ${V}y-ru video 30 6 2>&1 | tail -2
node capture.mjs ${V}s-ru cues 20 | tail -1; node capture.mjs ${V}y-ru cues 20 | tail -1
ffmpeg -y -v error -i out/${V}s-ru/video.mp4 -i out/${V}y-ru/end.mp4 -filter_complex "[0:v]trim=end_frame=2487,setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,fps=30[v]" -map "[v]" -c:v libx264 -crf 18 -pix_fmt yuv420p out/${V}y-ru/video.mp4
python3 v180_sound.py ${V}s-ru "$TR" "$OUT/s" | tail -1
python3 v180_sound.py ${V}y-ru "$TR" "$OUT/y" | tail -1
ffmpeg -y -v error -i out/${V}s-ru/video.mp4 -i "$OUT/s/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af apad -t 97.3333 -movflags +faststart "$OUT/Shorts_$V.mp4"
ffmpeg -y -v error -i out/${V}y-ru/video.mp4 -i "$OUT/y/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af apad -t 96.3667 -movflags +faststart "$OUT/YouTube_Bridge_$V.mp4"
python3 ref/qc.py "$OUT/Shorts_$V.mp4"
echo "ГОТОВО: $OUT/Shorts_$V.mp4  $OUT/YouTube_Bridge_$V.mp4"
