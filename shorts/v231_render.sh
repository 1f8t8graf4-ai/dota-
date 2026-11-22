#!/bin/bash
# v23.1 (22.11): два пролога фильма на выбор — v231y (A, по ТЗ Gemini) и v232y (B, мой), кусками по 12 с.
# Код — ep/v231/*.js + кадр главы 1 из ep/v230/30-ch1.js поверх набора главы 3 (05-kit); предметы — ep/v231/spr/*.png (node v231_spr.mjs).
# Таймлайн — python3 v231_tl.py (черновой, без голоса).
#   ./v231_render.sh [v231y-ru v232y-ru]   → out/<ролик>/video.mp4 и cues.json
#   ./v231_render.sh shots <ролик> t1,t2,… → out/<ролик>/shots/*.png
#   ./v231_render.sh seam [ролик]          → последний кадр пролога против кадра главы 1 при t = −1/30 (должны совпасть)
set -e
cd "$(dirname "$0")"
cat ep/v231/00-core.js ep/v200/05-kit.js ep/v231/10-text.js ep/v230/30-ch1.js ep/v231/40-scene.js ep/v231/99-main.js > ep/v231.js && node -e "new Function(require('fs').readFileSync('ep/v231.js','utf8'))"
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
tl() { mkdir -p out/$1; cp -f tl/$1.json out/$1/timeline.json; }
if [ "$1" = "shots" ]; then tl $2; rm -rf out/$2/shots; exec node capture.mjs $2 shots "$3"; fi
if [ "$1" = "seam" ]; then
  EP=${2:-v231y-ru}; tl $EP; L=${EP##*-}; C1=v170e-$L
  TE=$(python3 -c "import json;print(json.load(open('tl/$EP.json'))['dur'])")
  T1=$(python3 -c "print($TE-1/30)"); rm -rf out/$EP/shots out/$C1/shots
  node capture.mjs $EP shots "$T1" > /dev/null; node capture.mjs $C1 shots "-0.0333333333,0" > /dev/null
  python3 - "$EP" "$C1" <<'PY'
import sys, glob, numpy as np
from PIL import Image
a = sorted(glob.glob(f'out/{sys.argv[1]}/shots/*.png')); b = sorted(glob.glob(f'out/{sys.argv[2]}/shots/*.png'))
A = np.asarray(Image.open(a[-1]).convert('RGB'), float); B = [np.asarray(Image.open(p).convert('RGB'), float) for p in b]
print('последний кадр пролога − кадр главы 1 (t=−1/30): макс %.0f, средн %.3f' % (abs(A - B[0]).max(), abs(A - B[0]).mean()))
print('шаг главы 1 (−1/30 → 0): средн %.3f' % abs(B[1] - B[0]).mean())
PY
  exit 0
fi
for EP in ${@:-v231y-ru v232y-ru}; do
  tl $EP; D=out/$EP/parts; mkdir -p $D
  DUR=$(python3 -c "import json,math;print(math.ceil(json.load(open('tl/$EP.json'))['dur']*30-1e-6)/30)")
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
