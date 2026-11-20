#!/bin/bash
# v22.0 (20.11): рендер главы 5 «2022 · Снюс» (фильм с финалом и шортс) кусками по 12 с — прерванный рендер продолжает с места.
# Код главы — ep/v220/*.js поверх общего набора главы 3 (05-kit, 12-cam, 15-props); превращения — flubber (vendor/).
#   ./v220_render.sh [v220y-ru v220s-ru]   → out/<ролик>/video.mp4 и cues.json
#   ./v220_render.sh shots <ролик> t1,t2,…  → out/<ролик>/shots/*.png
set -e
cd "$(dirname "$0")"
cat ep/v220/00-core.js ep/v200/05-kit.js ep/v200/12-cam.js ep/v200/15-props.js ep/v220/[1-9]*.js > ep/v220.js && node -e "new Function(require('fs').readFileSync('ep/v220.js','utf8'))"
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
if [ "$1" = "shots" ]; then rm -rf out/$2/shots; exec node capture.mjs $2 shots "$3"; fi
for EP in ${@:-v220y-ru v220s-ru}; do
  D=out/$EP/parts; mkdir -p $D
  DUR=$(python3 -c "import json,math;print(math.ceil(json.load(open('tl/$EP.json'))['dur']*30)/30)")
  N=$(python3 -c "import math;print(math.ceil($DUR/12))")
  for ((k=0; k<N; k++)); do
    [ -f $D/p$k.done ] && continue
    A=$((k*12)); B=$(python3 -c "print(min(($k+1)*12, $DUR))")
    RANGE="$A-$B" OUTF=parts/p$k.mp4 node capture.mjs $EP video 30 3 2>&1 | grep -v "^WebGL" | tail -2
    touch $D/p$k.done
  done
  ( for ((k=0; k<N; k++)); do echo "file 'p$k.mp4'"; done ) > $D/list.txt
  ffmpeg -y -v error -f concat -safe 0 -i $D/list.txt -c copy out/$EP/video.mp4
  node capture.mjs $EP cues 1 | tail -1
  echo "$EP: $(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 out/$EP/video.mp4) кадров"
done
