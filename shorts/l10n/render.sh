#!/bin/bash
# 21.11: главы 1–3 на английском и немецком без новой записи голоса — картинка с переводом надписей и субтитров,
# звук (голос, музыка, звуки) — из готового русского ролика той же длины.
#   ./l10n/render.sh [v170e-en v191s-de …]   → out/<ролик>/video.mp4 и out/deliver-l10n/<Глава>_<язык>.mp4
# Кусками по 12 с — прерванный рендер продолжает с места (out/<ролик>/parts/p<k>.done).
set -e
cd "$(dirname "$0")/.."
cat ep/v191/*.js > ep/v191.js && cat ep/v200/*.js > ep/v200.js
for f in ep/v170.js ep/v191.js ep/v200.js ep/l10n.js ep/l10n-dict.js; do node -e "new Function(require('fs').readFileSync('$f','utf8'))"; done
python3 l10n/build.py > /dev/null
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
declare -A RU=( [v170e]=out/deliver192/FINAL_Bob_Ep1_YouTube_Bridge_v192.mp4 [v191s]=out/deliver193/FINAL_Led_Shorts_v193.mp4
  [v191y]=out/deliver202/FINAL_Led_YouTube_Bridge_v195.mp4 [v200s]=out/deliver205/FINAL_Marlboro_Ch3_Shorts_v205.mp4
  [v200y]=out/deliver205/FINAL_Marlboro_Ch3_Film_v205.mp4 )
declare -A NM=( [v170e]=Ch1_Bob_Film [v191s]=Ch2_Ice_Shorts [v191y]=Ch2_Ice_Film [v200s]=Ch3_Marlboro_Shorts [v200y]=Ch3_Marlboro_Film )
mkdir -p out/deliver-l10n
for EP in ${@:-v170e-en v170e-de v191s-en v191s-de v191y-en v191y-de v200s-en v200s-de v200y-en v200y-de}; do
  B=${EP%-*}; L=${EP##*-}
  D=out/$EP/parts; mkdir -p $D
  cp tl/$EP.json out/$EP/timeline.json   # таймлайн с субтитрами перевода — всегда свежий
  DUR=$(python3 -c "import json,math;print(math.ceil(json.load(open('tl/$EP.json'))['dur']*30)/30)")
  N=$(python3 -c "import math;print(math.ceil($DUR/12))")
  for ((k=0; k<N; k++)); do
    [ -f $D/p$k.done ] && continue
    A=$((k*12)); E=$(python3 -c "print(min(($k+1)*12, $DUR))")
    RANGE="$A-$E" OUTF=parts/p$k.mp4 node capture.mjs $EP video 30 3 2>&1 | grep -v "^WebGL" | tail -1
    touch $D/p$k.done
  done
  ( for ((k=0; k<N; k++)); do echo "file 'p$k.mp4'"; done ) > $D/list.txt
  ffmpeg -y -v error -f concat -safe 0 -i $D/list.txt -c copy out/$EP/video.mp4
  OUT=out/deliver-l10n/${NM[$B]}_${L^^}.mp4
  ffmpeg -y -v error -i out/$EP/video.mp4 -i ${RU[$B]} -map 0:v -map 1:a -c copy -shortest $OUT
  echo "$EP → $OUT: видео $(ffprobe -v error -show_entries format=duration -of csv=p=0 out/$EP/video.mp4) с, русский звук $(ffprobe -v error -show_entries format=duration -of csv=p=0 ${RU[$B]}) с"
done
