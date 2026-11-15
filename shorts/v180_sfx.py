#!/usr/bin/env python3
"""v18.0 (15.11, «я даю право на генерацию звука»): звуки 2-го выпуска — ElevenLabs sound-generation → sfx18/*.mp3 (готовые не перезаписывает).
Все — низкие, мягкие, без звонков и писка (правило ТЗ: без ding / tick / pin / swish)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from el13 import post, HERE
SFX18 = {
    'icecrack': ('ice crystals forming and cracking softly, frosty crackle, close-up, low and crisp, no music, no chime', 1.4),
    'snowroof': ('soft thump of a snow covered roof landing, powdery snow puff, muffled', 0.9),
    'neon':     ('old neon sign flickering on, low electrical buzz and hum, no beep', 1.2),
    'truck':    ('huge semi truck passing very close at night from right to left, deep diesel engine rumble, tire roar, doppler, no horn', 2.6),
    'blade':    ('heavy steel guillotine blade sliding fast down wooden rails and slamming into a wooden block, deep metallic clang and thud', 1.2),
    'splash':   ('juicy fruit juice splash burst, wet splat, droplets, no bell', 1.0),
    'chain':    ('heavy industrial chain and pulley moving slowly, metal rattle, low', 1.4),
    'scroll':   ('two heavy rollers unrolling a large paper scroll across a wooden table, low rolling rumble and paper rustle', 1.6),
    'conveyor': ('factory conveyor belt starting up, rollers rattling, heavy machinery hum, no alarm', 2.6),
    'wave':     ('giant ocean wave rising and crashing, deep rushing water', 3.0),
    'plop':     ('single heavy liquid drop falling into a full water tank, deep bloop and gentle splash', 0.9),
    'pageflip': ('large stiff paper sheet flipping over, single page turn, close-up', 0.8),
    'glassbulb':('soft magical glow swelling up, warm low synth swell, no chime, no bell', 1.2),
    'leaves':   ('dry leaves wilting and falling, soft rustle', 1.2),
    'register': ('vintage mechanical cash register lever pulled and cash drawer sliding open with a heavy clunk, no bell', 1.4),
    'counter':  ('mechanical number counter wheels rolling fast then stopping, low whirr and clatter, no beep', 1.4),
    'receipt':  ('receipt paper printing and feeding out of a thermal printer, soft mechanical buzz', 1.6),
    'city':     ('quiet night city ambience, distant traffic, soft wind, no music, no voices', 3.0),
    'cryptex':  ('heavy brass combination lock rings rotating with soft low clicks, then a solid unlocking clunk', 1.8),
    'lipstick': ('metal lipstick case cap pulled off with a soft pop, then lipstick twisted up, close-up', 1.2),
    'train':    ('fast metro monorail train rushing past very close from right to left, strong air whoosh, rail clatter, doppler, no horn, no bell', 1.6),
}
if __name__ == '__main__':
    d = os.path.join(HERE, 'sfx18'); os.makedirs(d, exist_ok=True)
    for name, (text, dur) in SFX18.items():
        f = os.path.join(d, name + '.mp3')
        if os.path.exists(f): continue
        r = post('/v1/sound-generation', {'text': text, 'duration_seconds': dur, 'prompt_influence': .55})
        print(name, {k: v for k, v in r.headers.items() if 'cost' in k.lower()}, len(r.content) // 1024, 'КБ', flush=True)
        open(f, 'wb').write(r.content)
