#!/bin/bash
# Контактный лист кадров: ./sheet.sh <ep-lang> t1,t2,... [колонок=6] [ширина кадра=270] → out/<ep>/sheet.png
cd "$(dirname "$0")"; EP=$1; TS=$2; COLS=${3:-6}; WD=${4:-270}
export NODE_PATH=${NODE_PATH:-/opt/node-tools/node_modules}
rm -rf out/$EP/shots; node capture.mjs $EP shots $TS || exit 1
N=$(ls out/$EP/shots/*.png | wc -l); ROWS=$(( (N + COLS - 1) / COLS ))
ffmpeg -v error -y -pattern_type glob -i "out/$EP/shots/*.png" -vf "scale=$WD:-1,drawtext=text='%{metadata\:t}':fontsize=1,tile=${COLS}x${ROWS}:padding=4:color=white" -frames:v 1 out/$EP/sheet.png 2>/dev/null || ffmpeg -v error -y -pattern_type glob -i "out/$EP/shots/*.png" -vf "scale=$WD:-1,tile=${COLS}x${ROWS}:padding=4:color=white" -frames:v 1 out/$EP/sheet.png
echo out/$EP/sheet.png
