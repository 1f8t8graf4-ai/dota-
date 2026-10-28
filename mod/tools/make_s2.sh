#!/usr/bin/env bash
# Сборщик мода s2bin = пакеты source2/{panorama,kv3,resource,vpk} из Modlock (github.com/paralin/modlock, MIT, коммит 5198246)
# + наша обёртка mod/tools/s2cli.go. Те же шаги, что делались руками 27–28.10; скриптом целиком в облаке не прогонялся.
# ВНИМАНИЕ: в облачной сессии сборку чужого кода пускают только с явного разрешения Андрея — спроси перед запуском.
# Использование: bash mod/tools/make_s2.sh <папка> → <папка>/s2/s2bin
# Дальше:  <папка>/s2/s2bin compile mod/restless-probe <папка>/v1.vpk citadel_addons/restless_probe
#          python3 mod/tools/vpk2.py <папка>/v1.vpk mod/build/pak42_dir.vpk
set -euo pipefail
W="${1:?папка для сборки}"; R="$(cd "$(dirname "$0")/../.." && pwd)"
mkdir -p "$W" && cd "$W"
[ -d modlock ] || git clone -q https://github.com/paralin/modlock modlock
git -C modlock checkout -q 5198246
rm -rf s2 && mkdir -p s2/cmd
for p in panorama kv3 resource vpk; do cp -r "modlock/source2/$p" s2/; done
grep -rl 'github.com/paralin/modlock/source2/' s2 | xargs sed -i 's#github.com/paralin/modlock/source2/#s2/#g'
find s2 -name '*_test.go' -delete
cp "$R/mod/tools/s2cli.go" s2/cmd/main.go
cd s2
printf 'module s2\n\ngo 1.24\n' > go.mod
GO="$(command -v go || echo /usr/local/go/bin/go)"
"$GO" mod tidy >/dev/null   # подтянет klauspost/compress, pierrec/lz4/v4, pkg/errors
"$GO" build -o s2bin ./cmd
echo "готово: $W/s2/s2bin"
