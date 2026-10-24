#!/bin/bash
# Бесшовная петля из AI-видео: хвост (0.7с) кроссфейдом в начало.
# Использование: ./hero_loop.sh IN.mp4 OUT.mp4 [дл_тела=5.3] [хвост=0.7]
IN="${1:?нет входного файла}"; OUT="${2:?нет выходного файла}"
BODY="${3:-5.3}"; TAIL="${4:-0.7}"
END=$(python3 -c "print($BODY+$TAIL)")
ffmpeg -y -v error -i "$IN" -filter_complex "\
[0:v]trim=0:${BODY},setpts=PTS-STARTPTS,fps=24[A];\
[0:v]trim=${BODY}:${END},setpts=PTS-STARTPTS,fps=24[B];\
[0:v]trim=0:${TAIL},setpts=PTS-STARTPTS,fps=24[C];\
[B][C]xfade=transition=fade:duration=${TAIL}:offset=0[BC];\
[A][BC]concat=n=2:v=1:a=0,scale=720:-2[out]" \
-map "[out]" -an -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT"
echo "OK: $OUT ($(du -h "$OUT" | cut -f1))"
