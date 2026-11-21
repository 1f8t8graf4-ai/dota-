#!/bin/bash
# v21.0 (19.11): рендер главы 4 «2014 · Нагреватели» кусками по 12 с — если процесс прервётся, готовые куски не рисуются заново.
# Код главы — ep/v210/*.js поверх общего набора главы 3 (05-kit, 12-cam, 15-props).
#   ./v210_render.sh [v210y-ru v210s-ru]   → out/<ролик>/video.mp4 и cues.json
set -e
cd "$(dirname "$0")"
cat ep/v210/00-core.js ep/v200/05-kit.js ep/v200/12-cam.js ep/v200/15-props.js ep/v210/[1-9]*.js > ep/v210.js && node -e "new Function(require('fs').readFileSync('ep/v210.js','utf8'))"
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
if [ "$1" = "shots" ]; then rm -rf out/$2/shots; exec node capture.mjs $2 shots "$3"; fi   # ./v210_render.sh shots <ролик> t1,t2,… → out/<ролик>/shots/*.png
for EP in ${@:-v210y-ru v210s-ru}; do
  D=out/$EP/parts; mkdir -p $D
  DUR=$(python3 -c "import json,math;print(math.ceil(json.load(open('tl/$EP.json'))['dur']*30)/30)")   # до последнего кадра включительно (у шортса он = кадр 0)
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
