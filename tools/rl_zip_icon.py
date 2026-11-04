# Значок «буст на канате» для мода Restless (0.24): трос по диагонали, ролик с ручкой, стрелка ускорения.
# Андрей: «сделай понятную иконку для зиплайна, вообще не понятно». Значок игры (hud/zipline_icon) в 20 px не читается.
# python3 tools/rl_zip_icon.py → restless/mm/zip.png (128×128, прозрачный фон)
from PIL import Image, ImageDraw
S = 4; W = 128 * S
im = Image.new('RGBA', (W, W), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
def L(p, w, c): d.line([(x * S, y * S) for x, y in p], fill=c, width=w * S, joint='curve')
def C(x, y, r, c): d.ellipse([(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S], fill=c)
OUT, CAB, Y, Y2 = (16, 14, 10, 255), (225, 225, 230, 255), (255, 200, 61, 255), (255, 232, 150, 255)
# трос
L([(6, 30), (122, 72)], 13, OUT); L([(6, 30), (122, 72)], 6, CAB)
# ролик на тросе
C(60, 49, 17, OUT); C(60, 49, 11, Y); C(60, 49, 4, OUT)
# ручка: стойка вниз и перекладина
L([(60, 58), (60, 92)], 13, OUT); L([(42, 96), (78, 96)], 15, OUT)
L([(60, 60), (60, 92)], 6, Y); L([(44, 96), (76, 96)], 8, Y)
# стрелки ускорения вдоль троса (вперёд-вниз)
for dx in (0, 20):
    a = [(86 + dx, 98), (100 + dx, 110), (86 + dx, 122)]
    L(a, 12, OUT); L(a, 6, Y2)
im = im.resize((128, 128), Image.LANCZOS)
im.save('restless/mm/zip.png')
prev = Image.new('RGBA', (260, 80), (20, 24, 30, 255))
for i, z in enumerate((64, 32, 22, 16)): prev.alpha_composite(im.resize((z, z), Image.LANCZOS), (10 + i * 70, 8))
prev.save('restless/mm/zip-icon.png')
print('restless/mm/zip.png')
