#!/bin/bash
# Проба 20.11 «инструменты»: собрать ep/vpr.js и отрендерить ролик vpr-ru (9:16, без голоса).
# Сначала кадры баночки: <venv с bpy>/bin/python proba/tin_blender.py out/vpr-tin
set -e
cd "$(dirname "$0")/.."
cat ep/vpr/00-core.js ep/v200/05-kit.js ep/v200/12-cam.js ep/v200/15-props.js ep/vpr/[1-9]*.js > ep/vpr.js
node -e "new Function(require('fs').readFileSync('ep/vpr.js','utf8'))"
[ "$1" = "shots" ] && exec node capture.mjs vpr-ru shots "$2"
node capture.mjs vpr-ru video 30 3
