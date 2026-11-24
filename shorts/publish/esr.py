#!/usr/bin/env python3
"""Real-ESRGAN x4plus anime 6B на numpy (без torch): esr.py <веса.pth> <вход> <выход.png> [плитка=192] [запас=16]"""
import sys, zipfile, pickle, collections, time
import numpy as np
from PIL import Image


def load_pth(path):
    z = zipfile.ZipFile(path); names = z.namelist(); root = names[0].split('/')[0]
    class U(pickle.Unpickler):
        def find_class(self, mod, name):
            if mod == 'collections' and name == 'OrderedDict': return collections.OrderedDict
            if mod == 'torch._utils' and name == '_rebuild_tensor_v2':
                def rb(st, off, size, stride, *a):
                    arr = np.lib.stride_tricks.as_strided(st[off:], shape=tuple(size), strides=tuple(s * st.itemsize for s in stride))
                    return np.array(arr, dtype=np.float32)
                return rb
            if mod == 'torch' and name.endswith('Storage'): return name
            raise pickle.UnpicklingError(f'{mod}.{name}')
        def persistent_load(self, pid):
            _, typ, key, loc, n = pid
            dt = {'FloatStorage': np.float32, 'HalfStorage': np.float16}[typ]
            return np.frombuffer(z.read(f'{root}/data/{key}'), dtype=dt)
    sd = U(z.open(f'{root}/data.pkl')).load()
    return sd.get('params_ema', sd.get('params', sd))


def conv(x, w, b, budget=24_000_000):
    C, H, W = x.shape; O = w.shape[0]; xp = np.pad(x, ((0, 0), (1, 1), (1, 1))); wm = w.reshape(O, -1).T
    out = np.empty((O, H, W), np.float32); rows = max(1, budget // (W * C * 9))
    for r0 in range(0, H, rows):
        r1 = min(H, r0 + rows); win = np.lib.stride_tricks.sliding_window_view(xp[:, r0:r1 + 2, :], (3, 3), axis=(1, 2))
        col = win.transpose(1, 2, 0, 3, 4).reshape((r1 - r0) * W, C * 9)
        out[:, r0:r1, :] = (col @ wm + b).T.reshape(O, r1 - r0, W)
    return out


lr = lambda x: np.maximum(x, 0.2 * x)
up = lambda x: x.repeat(2, axis=1).repeat(2, axis=2)


def net(sd, x, nb=6):
    P = lambda k: (sd[k + '.weight'], sd[k + '.bias'])
    f = conv(x, *P('conv_first')); body = f
    for i in range(nb):
        r = body
        for j in (1, 2, 3):
            pre = f'body.{i}.rdb{j}'; xs = [r]
            for k in range(1, 5): xs.append(lr(conv(np.concatenate(xs, 0), *P(f'{pre}.conv{k}'))))
            r = conv(np.concatenate(xs, 0), *P(f'{pre}.conv5')) * 0.2 + r
        body = r * 0.2 + body
    f = f + conv(body, *P('conv_body'))
    f = lr(conv(up(f), *P('conv_up1'))); f = lr(conv(up(f), *P('conv_up2')))
    return conv(lr(conv(f, *P('conv_hr'))), *P('conv_last'))


def compact(sd, x, r=4):   # SRVGGNetCompact (realesr-animevideov3): 18 свёрток + PReLU, pixel shuffle ×4, плюс вход ×4 «ближайшим»
    f = x; i = 0
    while f'body.{i}.weight' in sd:
        w = sd[f'body.{i}.weight']
        if w.ndim == 4: f = conv(f, w, sd[f'body.{i}.bias'])
        else: f = np.where(f > 0, f, w[:, None, None] * f)
        i += 1
    C, H, W = f.shape; f = f.reshape(3, r, r, H, W).transpose(0, 3, 1, 4, 2).reshape(3, H * r, W * r)
    return f + x.repeat(r, 1).repeat(r, 2)


def main():
    wp, src, dst = sys.argv[1:4]; T = int(sys.argv[4]) if len(sys.argv) > 4 else 192; pad = int(sys.argv[5]) if len(sys.argv) > 5 else 16
    sd = load_pth(wp); img = np.asarray(Image.open(src).convert('RGB'), np.float32).transpose(2, 0, 1) / 255
    _, H, W = img.shape; out = np.zeros((3, H * 4, W * 4), np.float32); t0 = time.time(); n = 0; tot = ((H + T - 1) // T) * ((W + T - 1) // T)
    for y in range(0, H, T):
        for x in range(0, W, T):
            y0, y1, x0, x1 = max(0, y - pad), min(H, y + T + pad), max(0, x - pad), min(W, x + T + pad)
            o = (net if 'conv_first.weight' in sd else compact)(sd, img[:, y0:y1, x0:x1]); yy, xx = (y - y0) * 4, (x - x0) * 4; h, w = (min(H, y + T) - y) * 4, (min(W, x + T) - x) * 4
            out[:, y * 4:y * 4 + h, x * 4:x * 4 + w] = o[:, yy:yy + h, xx:xx + w]; n += 1
            print(f'плитка {n}/{tot}, {time.time() - t0:.0f} с', flush=True)
    Image.fromarray((np.clip(out, 0, 1).transpose(1, 2, 0) * 255 + .5).astype(np.uint8)).save(dst); print(dst)


if __name__ == '__main__':
    main()
