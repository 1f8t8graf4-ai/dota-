# Проба 20.11: баночка из Blender в нашем стиле («Боб 2.0»: 3 тона, тень справа и холоднее, блик слева, тонкий контур).
# Blender считает только форму: нормали, номер материала и прозрачность (Cycles, без света). Цвета в 3 тона красим сами — numpy по нормалям,
# поэтому баночка выглядит так же, как наши рисованные предметы, а не как 3D-рендер.
#   <venv с bpy 4.5>/bin/python shorts/proba/tin_blender.py <папка>   → <папка>/c/0001.png … (RGBA 760×950)
# bpy ставится в отдельный venv на Python 3.11: python3.11 -m venv bpyenv && bpyenv/bin/pip install "bpy==4.5.16"
import sys, os, math, zlib, struct
import numpy as np
import bpy
from mathutils import Vector, Euler, Quaternion

OUT = os.path.abspath(sys.argv[-1] if len(sys.argv) > 1 and not sys.argv[-1].endswith('.py') else 'out/vpr-tin')
RAW, COL = os.path.join(OUT, 'raw'), os.path.join(OUT, 'c')
os.makedirs(RAW, exist_ok=True); os.makedirs(COL, exist_ok=True)
FPS, DUR, RES = 30, 5.5, 760
NF = int(os.environ.get('NFR') or round(FPS * DUR))

# ---------- палитра (B2 из ep/v200/05-kit.js) ----------
NAVY = np.array([0x14, 0x17, 0x33]) / 255
LN = np.array([0xee, 0xf1, 0xf8]) / 255
def hx(h): return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)]) / 255
PAL = {1: hx('#F4F1EA'), 2: hx('#FBFAF7'), 3: hx('#CFC8BC'), 4: hx('#EFE6D2'), 5: hx('#5ED39B'), 6: hx('#E9E4DA')}   # корпус, крышка, дно, подушечки, полоса вкуса, стенка внутри

# ---------- сцена ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 6; sc.cycles.use_denoising = False
sc.cycles.max_bounces = 0; sc.cycles.use_adaptive_sampling = False
sc.render.resolution_x = RES; sc.render.resolution_y = int(RES * 1.25); sc.render.film_transparent = True
sc.render.fps = FPS
vl = sc.view_layers[0]; vl.use_pass_normal = True; vl.use_pass_material_index = True
w = bpy.data.worlds.new('w'); sc.world = w; w.color = (0, 0, 0)

def mat(i):
    m = bpy.data.materials.new('m%d' % i); m.pass_index = i; return m
MATS = {i: mat(i) for i in PAL}

def cyl(r, depth, z, fill='NGON', verts=128, name='c'):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=(0, 0, z), end_fill_type=fill)
    o = bpy.context.active_object; o.name = name; return o

def bevel(o, wdt, seg=3, ang=40):
    m = o.modifiers.new('bv', 'BEVEL'); m.width = wdt; m.segments = seg; m.limit_method = 'ANGLE'; m.angle_limit = math.radians(ang); m.harden_normals = True

def smooth(o):
    for p in o.data.polygons: p.use_smooth = True

def setmat(o, i):
    o.data.materials.clear(); o.data.materials.append(MATS[i])

root = bpy.data.objects.new('tin', None); sc.collection.objects.link(root)
# корпус: стенка с толщиной (открытый цилиндр + solidify), дно внутри
body = cyl(1.0, .42, .21, fill='NOTHING', name='body'); setmat(body, 1)
body.data.materials.append(MATS[6])
sol = body.modifiers.new('sol', 'SOLIDIFY'); sol.thickness = .045; sol.offset = -1; sol.material_offset = 1; sol.use_rim = True
bevel(body, .012, 2, 60); smooth(body); body.parent = root
floor = cyl(.955, .02, .11, fill='NGON', name='floor'); setmat(floor, 3); body_bottom = cyl(1.0, .02, .01, name='bottom'); setmat(body_bottom, 1)
for o in (floor, body_bottom): o.parent = root
# подушечки по кругу, внахлёст — как в настоящей баночке
POUCH = []
N = 13
for k in range(N):
    a = k / N * math.tau
    bpy.ops.mesh.primitive_cube_add(size=1, location=(math.cos(a) * .55, math.sin(a) * .55, .18))
    p = bpy.context.active_object; p.name = 'pouch%d' % k
    p.scale = (.5, .21, .075); p.rotation_euler = Euler((math.radians(16), 0, a), 'XYZ')
    bevel(p, .12, 5, 30); smooth(p); setmat(p, 4); p.parent = root; POUCH.append(p)
# крышка: купол сверху, открытая снизу, полоса цвета вкуса по боку
lid = cyl(1.035, .2, .52, fill='TRIFAN', name='lid'); setmat(lid, 2)
me = lid.data; top = max(v.co.z for v in me.vertices)
for v in me.vertices:
    if abs(v.co.z - top) < 1e-6:
        r = math.hypot(v.co.x, v.co.y); v.co.z += .07 * (1 - (r / 1.035) ** 2)
# снять нижнюю крышку (у TRIFAN закрыты обе стороны): удаляем грани ниже середины, кроме боковых
import bmesh
bm = bmesh.new(); bm.from_mesh(me)
bot = min(v.co.z for v in bm.verts)
bmesh.ops.delete(bm, geom=[f for f in bm.faces if all(abs(v.co.z - bot) < 1e-6 for v in f.verts)], context='FACES')
bm.to_mesh(me); bm.free()
sl = lid.modifiers.new('sol', 'SOLIDIFY'); sl.thickness = .04; sl.offset = -1
bevel(lid, .03, 3, 50); smooth(lid)
band = cyl(1.04, .07, .5, fill='NOTHING', name='band'); setmat(band, 5); smooth(band)
topz = .52 + .1 + .03
ring1 = cyl(.8, .004, topz, fill='NGON', name='ring1'); setmat(ring1, 5)
ring2 = cyl(.72, .004, topz + .004, fill='NGON', name='ring2'); setmat(ring2, 2)
lid.parent = root
for o in (band, ring1, ring2): o.parent = lid; o.matrix_parent_inverse = lid.matrix_world.inverted()   # полоса и кольцо едут вместе с крышкой
LID0 = lid.location.copy()

cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.data.lens = 55; cam.data.sensor_width = 36   # с запасом по краям: крышка и пакетик не вылезают из картинки
TGT = Vector((0, 0, .5))

# ---------- выход: нормали, номер материала, прозрачность — в EXR (их же читает bpy) ----------
sc.use_nodes = True; tr = sc.node_tree; tr.nodes.clear()
rl = tr.nodes.new('CompositorNodeRLayers')
fo = tr.nodes.new('CompositorNodeOutputFile'); fo.base_path = RAW; fo.format.file_format = 'OPEN_EXR'; fo.format.color_depth = '16'
fo.file_slots.clear()
for nm in ('n_', 'i_', 'a_'): fo.file_slots.new(nm)
tr.links.new(rl.outputs['Normal'], fo.inputs['n_']); tr.links.new(rl.outputs['IndexMA'], fo.inputs['i_']); tr.links.new(rl.outputs['Image'], fo.inputs['a_'])
comp = tr.nodes.new('CompositorNodeComposite'); tr.links.new(rl.outputs['Image'], comp.inputs['Image'])

def ease(k): k = min(1, max(0, k)); return k * k * (3 - 2 * k)
def spr(k):
    if k <= 0: return 0
    if k >= 1: return 1
    return 1 - math.exp(-6.2 * k) * math.cos(10.5 * k)

def place(t):
    el = math.radians(82 + (36 - 82) * ease(t / 1.7)); az = -.35 + .11 * t; d = 7.6
    cam.location = TGT + Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el))) * d
    cam.rotation_euler = (TGT - cam.location).to_track_quat('-Z', 'Y').to_euler()
    k = spr((t - 1.8) / 1.3)   # крышка: поднимается и встаёт за баночкой лицом к нам
    kp = min(k, 1.04); lid.location = LID0 + Vector((.08 * kp, 1.2 * kp, .9 * kp));   # перелёт пружины — только в наклоне, не выше кадра
    lid.rotation_euler = Euler((math.radians(45) * k, math.radians(4) * k, 0), 'XYZ')
    j = ease((t - 3.2) / 1.3); p = POUCH[(N * 3) // 4]   # передняя подушечка выезжает к камере и встаёт к ней лицом
    a = (N * 3) // 4 / N * math.tau
    p0 = Vector((math.cos(a) * .55, math.sin(a) * .55, .18)); dc = (cam.location - TGT).normalized()
    p.location = p0.lerp(TGT + dc * 4.4 + Vector((0, 0, -.2)), j)
    q0 = Euler((math.radians(16), 0, a), 'XYZ').to_quaternion(); q1 = Quaternion((0, 0, 1), math.radians(-12)) @ dc.to_track_quat('Z', 'Y')   # чуть повёрнута — видно толщину с тенью
    p.rotation_mode = 'QUATERNION'; p.rotation_quaternion = q0.slerp(q1, j); s = 1 + .5 * j; p.scale = (.5 * s, .21 * s, .075 * s)

def readexr(path, ch):
    im = bpy.data.images.load(path, check_existing=False); W, H = im.size
    buf = np.empty(W * H * 4, dtype=np.float32); im.pixels.foreach_get(buf); bpy.data.images.remove(im)
    return buf.reshape(H, W, 4)[::-1, :, :ch]   # Blender хранит снизу вверх

def png(path, rgba):
    H, W, _ = rgba.shape; raw = b''.join(b'\x00' + rgba[y].tobytes() for y in range(H))
    def chunk(t, d): c = t + d; return struct.pack('>I', len(d)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    open(path, 'wb').write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', W, H, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 6)) + chunk(b'IEND', b''))

def toon(fr):
    n = readexr(os.path.join(RAW, 'n_%04d.exr' % fr), 3); ix = np.rint(readexr(os.path.join(RAW, 'i_%04d.exr' % fr), 1)[..., 0]).astype(int)
    al = readexr(os.path.join(RAW, 'a_%04d.exr' % fr), 4)[..., 3]
    R = cam.matrix_world.to_3x3(); L = np.array(R @ Vector((-.75, .05, .65)).normalized())   # свет слева спереди: блик полосой слева, тень — правая четверть, как у рисованных предметов
    s = (n * L).sum(-1)
    out = np.zeros(ix.shape + (3,))
    for i, base in PAL.items():
        m = ix == i
        if not m.any(): continue
        hi = base + (1 - base) * .45; sh = base * .7 + NAVY * .3
        out[m] = np.where((s[m] > .86)[:, None], hi, np.where((s[m] > .12)[:, None], base, sh))   # пороги — подальше от значений плоского верха (0,43…0,66): без пятен на крышке
    # контур: между материалами — тёмный тонкий, по краю силуэта — светлый (как у наших предметов)
    e = np.zeros(ix.shape, bool)
    for dy, dx in ((0, 1), (1, 0)):
        a, b = ix, np.roll(np.roll(ix, dy, 0), dx, 1); e |= (a != b) & (a > 0) & (b > 0)
    out[e] = out[e] * .45 + NAVY * .55
    edge = (al > .02) & (al < .98)
    out[edge] = out[edge] * .4 + LN * .6
    rgba = np.concatenate([np.clip(out, 0, 1), al[..., None]], -1)
    png(os.path.join(COL, '%04d.png' % fr), (rgba * 255 + .5).astype(np.uint8))

FRS = [int(x) - 1 for x in os.environ['FRS'].split(',')] if os.environ.get('FRS') else range(NF)   # FRS=1,60,120 — только эти кадры (проба)
for f in FRS:
    sc.frame_set(f + 1); place(f / FPS)
    bpy.ops.render.render(write_still=False)
    toon(f + 1)
    if f % 15 == 0: print('кадр', f + 1, 'из', NF, flush=True)
print('готово:', COL)
