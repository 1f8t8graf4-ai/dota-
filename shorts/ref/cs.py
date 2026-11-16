import sys, glob, os
from PIL import Image, ImageDraw
d = sys.argv[1]; out = sys.argv[2]; W = int(sys.argv[3]) if len(sys.argv) > 3 else 360
fs = sorted(glob.glob(os.path.join(d, '*.png')))
H = W * 16 // 9; cols = min(6, len(fs)); rows = (len(fs) + cols - 1) // cols
S = Image.new('RGB', (cols * W, rows * (H + 24)), 'white'); D = ImageDraw.Draw(S)
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB').resize((W, H)); x, y = (i % cols) * W, (i // cols) * (H + 24)
    S.paste(im, (x, y + 24)); D.text((x + 6, y + 4), os.path.basename(f)[1:-4], fill='black')
S.save(out, quality=88); print(out, S.size)
