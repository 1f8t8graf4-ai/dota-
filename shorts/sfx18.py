#!/usr/bin/env python3
"""v18 (15.11, ночь, «да» Андрея — ElevenLabs до 5 000 кредитов): звуки выпуска 2 и мостика выпуска 1 → sfx18/*.mp3 (готовые не перезаписывает)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from el13 import post
HERE = os.path.dirname(os.path.abspath(__file__))
SFX18 = {
    'frost':    ('frost crystals spreading quickly over glass, crisp crackling ice forming, close-up, no music', 1.8),
    'icecrack': ('thin sheet of black ice cracking and shattering into small pieces that tinkle down, close-up, no music', 1.6),
    'blade':    ('heavy steel guillotine blade sliding down fast and slamming into wood, sharp metallic clang, no music', 1.4),
    'splash':   ('juicy fruit liquid splash with droplets, wet and short, no music', 0.8),
    'conveyor': ('factory conveyor belt with rattling metal rollers, steady mechanical hum, no music, no voices', 3.0),
    'wave':     ('huge ocean wave swelling and crashing, deep rumble and foam, no music', 2.6),
    'pop':      ('plastic cap popping off a small device, crisp pop, close-up, no music', 0.5),
    'register': ('vintage mechanical cash register drawer opening with a bell, cha-ching, no music', 1.4),
    'scroll':   ('large paper scroll unrolling quickly across a table, paper rustle, no music', 1.2),
    'drip':     ('single liquid drop falling into liquid, clean plop with a tiny splash, close-up, no music', 0.6),
    'cryptex':  ('mechanical combination lock dials clicking several times, then a metal latch unlocks with a clunk, no music', 1.8),
    'lipstick': ('metal lipstick cap pulled off with a soft pop, then the lipstick twisting up, close-up, no music', 1.0),
    'truck':    ('big truck driving past at night, engine rumble with doppler, no music', 2.4),
    'icewind':  ('cold icy wind gust with a frosty shimmer, short whoosh, no music', 1.2),
}
d = os.path.join(HERE, 'sfx18'); os.makedirs(d, exist_ok=True)
for name, (text, dur) in SFX18.items():
    f = os.path.join(d, name + '.mp3')
    if os.path.exists(f): continue
    r = post('/v1/sound-generation', {'text': text, 'duration_seconds': dur, 'prompt_influence': .55})
    print(name, 'стоимость:', {k: v for k, v in r.headers.items() if 'cost' in k.lower()}, len(r.content) // 1024, 'КБ')
    open(f, 'wb').write(r.content)
