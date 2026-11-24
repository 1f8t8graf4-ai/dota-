#!/usr/bin/env python3
"""Превью для YouTube из готовой картинки: JPG 3840×2160 и 1280×720, меньше 2 МБ (лимит YouTube на значок).
python3 yt_thumb_prep.py <картинка 16:9> <префикс вывода>  →  <префикс>_3840x2160.jpg, <префикс>_1280x720.jpg
Почему так: PNG 4K весит больше 2 МБ; JPG без прореживания цвета (subsampling=0) — красный текст на тёмном не мылится после пережатия YouTube."""
import os, sys
from PIL import Image, ImageFilter

src, pre = sys.argv[1], sys.argv[2]
a = Image.open(src).convert('RGB')
W, H = a.size; k = max(3840 / W, 2160 / H)
if (W, H) != (3840, 2160):
    r = a.resize((round(W * k), round(H * k)), Image.LANCZOS); l = (r.width - 3840) // 2; t = (r.height - 2160) // 2
    a = r.crop((l, t, l + 3840, t + 2160))
for w, h, sharp in [(3840, 2160, False), (1280, 720, True)]:
    b = a if w == 3840 else a.resize((w, h), Image.LANCZOS)
    if sharp: b = b.filter(ImageFilter.UnsharpMask(radius=0.8, percent=55, threshold=2))
    f = f'{pre}_{w}x{h}.jpg'
    for q in (95, 93, 90, 88, 85):
        b.save(f, quality=q, subsampling=0, optimize=True)
        if os.path.getsize(f) < 1.9e6: break
    print(f, q, round(os.path.getsize(f) / 1e6, 2), 'МБ')
