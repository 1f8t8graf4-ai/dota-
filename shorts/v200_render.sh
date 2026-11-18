#!/bin/bash
# v20.0 (18.11): рендер главы 3 «1924 · Мальборо» кусками по 12 с — если процесс прервётся, готовые куски не рисуются заново.
#   ./v200_render.sh [v200y-ru v200s-ru]   → out/<ролик>/video.mp4 и cues.json
set -e
cd "$(dirname "$0")"
cat ep/v200/*.js > ep/v200.js && node -e "new Function(require('fs').readFileSync('ep/v200.js','utf8'))"
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
for EP in ${@:-v200y-ru v200s-ru}; do
  D=out/$EP/parts; mkdir -p $D
  DUR=$(python3 -c "import json;print(json.load(open('tl/$EP.json'))['dur'])")
  N=$(python3 -c "import math;print(math.ceil($DUR/12))")
  for ((k=0; k<N; k++)); do
    [ -f $D/p$k.done ] && continue
    A=$((k*12)); B=$(python3 -c "print(min(($k+1)*12, $DUR))")
    RANGE="$A-$B" OUTF=parts/p$k.mp4 node capture.mjs $EP video 30 3 2>&1 | grep -v "^WebGL" | tail -2
    touch $D/p$k.done
  done
  ( for ((k=0; k<N; k++)); do echo "file 'p$k.mp4'"; done ) > $D/list.txt
  ffmpeg -y -v error -f concat -safe 0 -i $D/list.txt -c copy out/$EP/video.mp4
  node capture.mjs $EP cues 1 | tail -1   # звуки считаются в init — кадры рисовать не нужно
  echo "$EP: $(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 out/$EP/video.mp4) кадров"
done
