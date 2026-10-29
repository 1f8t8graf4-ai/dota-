#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Сборка Restless 0.12:
  - скрипт 0.12 (3-значные КД из 0.11 + метка версии);
  - из пака УБРАНА наша копия hud_escape_menu (кнопку ставит скрипт — пак не спорит с QoL);
  - хвост пака пересчитан правильно (md5 дерева + md5('') + md5 всего до конца) —
    именно из-за непересчитанного хвоста 0.11 у Андрея не грузился весь пак.
"""
import struct, hashlib, zlib, sys
sys.path.insert(0, '/home/z/my-project/scripts')
from vpk_build import build, parse, SIG

UP   = '/home/z/my-project/upload/pak42_dir.vpk'
JS   = '/home/z/my-project/wt-sources/mod/restless-probe/panorama/scripts/restless.js'
OUT  = '/home/z/my-project/download/pak42_dir.vpk'
META_LEN, CRC_OFF, SRC_LEN = 1200, 923, 26285

d = open(UP, 'rb').read()
files = {n: c for _e, _p, n, _c, c in parse(d)}
meta = files['restless'][:META_LEN]
assert struct.unpack_from('<I', meta, 32)[0] == META_LEN - 32, 'неожиданный DATA offset'
assert struct.unpack_from('<I', meta, 36)[0] == SRC_LEN, 'длина источника в метаданных не 26285'
assert struct.unpack_from('<I', meta, 0)[0] == META_LEN + SRC_LEN, 'полная длина vjs_c не сходится'

# ---------- скрипт 0.12 (длина строго 26285, как вшито в метаданные) ----------
src = open(JS, 'r', encoding='utf-8').read()
edits = [
    ('// Restless 0.11.',
     '// Restless 0.12.\n'
     '// 0.12: копию меню Esc из пака убрали — кнопку ставит скрипт в любое меню.'),
    ("var VER = '0.11';", "var VER = '0.12';"),
    ('// 0.11: КД ульты из 3 цифр (100+ с): игра их не показывает, мы рисуем — но мельче (12px вместо 17px).',
     '// 0.11: 3-значные КД (100+ с) рисуем сами, мельче двузначных.'),
    ('// 0.10: в окне RESTLESS — блок «Что видит мод»: души, игроки и КД ульт, ячейки магазина с названиями, лагеря на миникарте.\n'
     '// Это проверка перед следующими шагами (подсветка сборки в магазине, таймеры лагерей): по фото блока видно, до чего мод дотягивается.',
     '// 0.10: в окне RESTLESS — блок «Что видит мод»: души, игроки и ульты, ячейки магазина, лагеря.'),
    ('// 0.9.1: КД ульты мигал из-за нескольких копий — видимость и число держим у самой подписи ($.Localize на каждом такте).',
     '// 0.9.1: видимость и число КД держим у самой подписи на каждом такте.'),
]
for old, new in edits:
    assert src.count(old) == 1, 'якорь не уникален: %r' % old[:40]
    src = src.replace(old, new)
blob = src.encode('utf-8')
assert len(blob) <= SRC_LEN, '0.12 длиннее эталона на %d — сократить комментарий' % (len(blob) - SRC_LEN)
blob += b' ' * (SRC_LEN - len(blob))
assert len(blob) == SRC_LEN
open(JS, 'wb').write(blob)  # исходник на диске = то, что в паке
print('скрипт 0.12: %d байт (паддинг %d)' % (len(blob), SRC_LEN - len(src.encode("utf-8"))))

# ---------- vjs_c: метаданные эталона + новый CRC источника ----------
vjs = bytearray(meta)
struct.pack_into('<I', vjs, CRC_OFF, zlib.crc32(blob) & 0xFFFFFFFF)
vjs = bytes(vjs) + blob
assert len(vjs) == META_LEN + SRC_LEN

# ---------- пак: без hud_escape_menu ----------
pack, tree, data = build([
    ('vjs_c', 'panorama/scripts', 'restless', vjs),
    ('vxml_c', 'panorama/layout', 'citadel_hud_subtitles', files['citadel_hud_subtitles']),
    ('vxml_c', 'panorama/layout', 'hud_movement_speed', files['hud_movement_speed']),
])
open(OUT, 'wb').write(pack)
print('пак 0.12: %s (%d байт; был 49073)' % (OUT, len(pack)))

# ---------- самопроверка ----------
chk = parse(open(OUT, 'rb').read())
assert [x[2] for x in chk] == ['restless', 'citadel_hud_subtitles', 'hud_movement_speed']
for _e, _p, n, crc, c in chk:
    assert zlib.crc32(c) & 0xFFFFFFFF == crc, 'CRC не сошёлся: ' + n
tb = pack[28:28+struct.unpack_from('<I', pack, 8)[0]]
assert pack[-48:-32] == hashlib.md5(tb).digest(), 'md5 дерева в хвосте'
assert pack[-32:-16] == hashlib.md5(b'').digest(), 'md5 заглушки'
assert pack[-16:] == hashlib.md5(pack[:-16]).digest(), 'md5 файла до хвоста'
vj = [c for _e, _p, n, _c, c in chk if n == 'restless'][0]
assert zlib.crc32(vj[META_LEN:]) & 0xFFFFFFFF == struct.unpack_from('<I', vj, CRC_OFF)[0]
assert b"var VER = '0.12'" in vj[META_LEN:]
print('самопроверка пака: CRC, md5-хвост, версия 0.12 — всё сошлось')
