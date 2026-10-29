#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Сборщик pak42_dir.vpk (формат как у эталонного 0.10, писанного vpk2.py).

Формат VPK v2 (как в эталоне):
  заголовок 28 байт: sig=55AA1234, ver=2, treesz, FileDataSize, 0, 48, 0
  дерево: ext\0 path\0 name\0 [crc(4) pre(2) arch=0x7FFF(2) foff(4) flen(4) ffff(2)] ... + b'\0\0\0'
  данные подряд сразу после дерева
  хвост 48 байт: md5(дерево) + md5(b'') + md5(всё_до_этого_места)

Проверка сборщика: пересборка 0.10 из частей совпадает с эталоном байт в байт.
"""
import struct, hashlib, io, sys

SIG = 0x55AA1234

def build(files):
    """files: список (ext, path, name, content_bytes) в порядке дерева."""
    # группируем ext -> path -> [name], порядок входа
    exts = {}
    for ext, path, name, content in files:
        exts.setdefault(ext, {}).setdefault(path, []).append((name, content))
    tree = io.BytesIO()
    data = io.BytesIO()
    foff = 0
    for ext, paths in exts.items():
        tree.write(ext.encode() + b'\x00')
        for path, names in paths.items():
            tree.write(path.encode() + b'\x00')
            for name, content in names:
                crc = _crc32(content)
                tree.write(name.encode() + b'\x00')
                tree.write(struct.pack('<IHHII', crc, 0, 0x7FFF, foff, len(content)))
                tree.write(b'\xff\xff')
                data.write(content)
                foff += len(content)
            tree.write(b'\x00')   # конец списка файлов
        tree.write(b'\x00')       # конец списка путей
    tree.write(b'\x00')           # конец списка расширений
    tb = tree.getvalue(); db = data.getvalue()
    header = struct.pack('<IIIIIII', SIG, 2, len(tb), len(db), 0, 48, 0)
    h1 = hashlib.md5(tb).digest()
    h2 = hashlib.md5(b'').digest()
    pre = header + tb + db + h1 + h2
    h3 = hashlib.md5(pre).digest()
    return pre + h3, tb, db

def _crc32(b):
    import zlib
    return zlib.crc32(b) & 0xFFFFFFFF

def parse(d):
    sig, ver, treesz = struct.unpack_from('<III', d, 0)
    assert sig == SIG and ver == 2, 'не тот формат'
    off = 28
    tree_end = off + treesz
    entries = []
    p = off
    def cstr(o):
        e = d.index(b'\x00', o)
        return d[o:e].decode(), e + 1
    while p < tree_end:
        ext, p = cstr(p)
        if not ext:
            break
        while True:
            path, p = cstr(p)
            if not path:
                break
            while True:
                name, p = cstr(p)
                if not name:
                    break
                crc, pre, arch, foff, flen = struct.unpack_from('<IHHII', d, p)
                p += 16 + 2 + pre
                entries.append((ext, path, name, crc, foff, flen))
    base = tree_end
    out = []
    for ext, path, name, crc, foff, flen in entries:
        out.append((ext, path, name, crc, d[base+foff:base+foff+flen]))
    return out

if __name__ == '__main__':
    UP = '/home/z/my-project/upload/pak42_dir.vpk'
    d = open(UP, 'rb').read()
    files = parse(d)
    # --- тест 1: пересборка 0.10 == эталон ---
    rebuilt, tb, db = build([(x[0], x[1], x[2], x[4]) for x in files])
    print('пересборка 0.10 == эталон:', rebuilt == d)
    if rebuilt != d:
        # найти первое расхождение
        for i, (a, b) in enumerate(zip(rebuilt, d)):
            if a != b:
                print('первое расхождение на %d: %02x != %02x' % (i, a, b))
                print('контекст новой:', rebuilt[max(0,i-16):i+16].hex(' '))
                print('контекст эталон:', d[max(0,i-16):i+16].hex(' '))
                break
        sys.exit(1)
