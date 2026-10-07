#!/usr/bin/env bash
# Нарезать эпизод сцены из исходника фильма.
#   tools/cut_episode.sh <исходник> <начало, сек> <конец, сек> <выход.mp4> [hdr]
# Пример: tools/cut_episode.sh film.mkv 612.4 659.8 scenes/american-psycho/01.mp4
# Звук: по умолчанию английская дорожка. Если её не находит — AUDIO=0:a:1 tools/cut_episode.sh ... (номер дорожки из ffprobe).
# 5-й аргумент "hdr" — если исходник 4K HDR (картинка бледная): переводит цвет в обычный SDR.
set -e
IN="$1"; A="$2"; B="$3"; OUT="$4"; HDR="$5"
DUR=$(python3 -c "print(round($B-$A,3))")
TONE=""
[ "$HDR" = "hdr" ] && TONE="zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p,"
# Мягкий «тикток-лук»: без шумодава (он даёт кляксы), лёгкая резкость CAS, деband, чуть контраста, лёгкое зерно.
LOOK="scale=1920:-2:flags=lanczos,deband=1thr=0.02:2thr=0.02:3thr=0.02:range=16:blur=1,cas=0.55,eq=contrast=1.08:saturation=0.88,curves=all='0/0 0.08/0.05 0.5/0.51 0.92/0.95 1/1',noise=alls=4:allf=t"
mkdir -p "$(dirname "$OUT")"
ffmpeg -y -ss "$A" -t "$DUR" -i "$IN" -map 0:v:0 -map "${AUDIO:-0:a:m:language:eng}" \
  -vf "${TONE}${LOOK}" -c:v libx264 -preset slow -crf 19 -maxrate 8M -bufsize 16M -profile:v high -pix_fmt yuv420p \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 160k -ac 2 -movflags +faststart "$OUT"
# превью эпизода (кадр на 1-й секунде)
ffmpeg -y -loglevel error -ss 1 -i "$OUT" -frames:v 1 -q:v 3 "${OUT%.mp4}.jpg"
echo "готово: $OUT"
