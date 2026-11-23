#!/bin/bash
# 24.11: проверка готового фильма перед отдачей (ТЗ Андрея): разрешение, длительность, звук, тишина, пики, громкость, зависшие кадры
#   ./film_check.sh <файл.mp4> [лог]
F=$1; L=${2:-${F%.*}_check.txt}
{
echo "Файл: $(basename "$F")  ($(du -h "$F" | cut -f1))"
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,sample_rate,channels,bit_rate -show_entries format=duration,bit_rate -of default=nw=1 "$F" | sed 's/^/  /'
echo; echo "== silencedetect (порог -35 dB, дольше 2 с) =="
S=$(ffmpeg -hide_banner -nostats -i "$F" -vn -af silencedetect=noise=-35dB:d=2 -f null - 2>&1 | grep -E "silence_(start|end)")
if [ -z "$S" ]; then echo "  тишины дольше 2 с нет"; else echo "$S" | sed 's/^/  /'; fi
echo; echo "== volumedetect =="
ffmpeg -hide_banner -nostats -i "$F" -vn -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume" | sed 's/.*\] /  /'
echo; echo "== громкость (EBU R128) =="
ffmpeg -hide_banner -nostats -i "$F" -vn -af ebur128=peak=true -f null - 2>&1 | grep -A 12 "Summary" | grep -E "I:|LRA:|Peak:" | sed 's/^ */  /'
echo; echo "== зависшие кадры (freezedetect, дольше 1,5 с) =="
Z=$(ffmpeg -hide_banner -nostats -i "$F" -an -vf "scale=480:-2,freezedetect=n=0.002:d=1.5" -f null - 2>&1 | grep -E "freeze_(start|duration)")
if [ -z "$Z" ]; then echo "  нет"; else echo "$Z" | sed 's/.*\] /  /'; fi
} | tee "$L"
