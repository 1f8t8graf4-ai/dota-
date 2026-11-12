#!/usr/bin/env python3
"""Оборачивает собранный пульт в ту же «рубашку», что ставит просмотрщик Claude (charset, viewport), для тестов.
python3 wrap.py ../pult-v16-3.html T_new.html  (старую версию для сравнения можно положить как T_old.html)"""
import sys
src, dst = sys.argv[1], sys.argv[2]
sk = ('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover">'
      '<style>*,*::before,*::after{box-sizing:border-box}</style></head><body>')
open(dst, 'w', encoding='utf-8').write(sk + open(src, encoding='utf-8').read() + '</body></html>')
print(dst)
