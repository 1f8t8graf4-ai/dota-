#!/usr/bin/env python3
"""13.9.17: ролики «Фразы дня» для бота — по data/daily.json режет кусок эпизода вокруг фразы
и вшивает субтитры (оригинал + перевод), чтобы было понятно и без звука (в Telegram видео в чате играет без звука).
Вход — эпизоды из клона ../scenes/<сцена>/NN.mp4, выход — ../scenes/_daily/NNN.mp4 (720p, ~0.5–1.5 МБ).
Запуск из корня репо: python3 tools/daily_cut.py [номера через запятую]   → потом python3 tools/r2_up.py _daily"""
import json, os, sys, subprocess, tempfile
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SC = os.path.join(os.path.dirname(root), 'scenes')
S = {s['id']: s for s in json.load(open(os.path.join(root, 'data', 'scenes.json'), encoding='utf-8'))['SCENES']}
D = json.load(open(os.path.join(root, 'data', 'daily.json'), encoding='utf-8'))['DAILY']
only = {int(x) for x in sys.argv[1].split(',')} if len(sys.argv) > 1 else None
FONT = 'DejaVu Sans'
def probe(p):
    o = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', p], capture_output=True, text=True).stdout
    j = json.loads(o); st = j['streams'][0]
    return st['width'], st['height'], float(j['format']['duration'])
def ass_t(t):
    return '%d:%02d:%05.2f' % (t // 3600, (t % 3600) // 60, t % 60)
def esc(t):
    return t.replace('\\', '').replace('{', '(').replace('}', ')').replace('\n', ' ')
os.makedirs(os.path.join(SC, '_daily'), exist_ok=True)
for i, x in enumerate(D, 1):
    if only and i not in only:
        continue
    s = S[x['sid']]; p = s['parts'][x['pi']]; f = p['ph'][x['n']]
    src = os.path.join(SC, s['id'], '%02d.mp4' % (x['pi'] + 1))
    out = os.path.join(SC, x['clip'].replace('scenes/', '', 1))
    W, H, dur = probe(src)
    a, b = f['a'] - p['a'] - 1.4, f['b'] - p['a'] + 1.0   # немного до фразы — чтобы был контекст
    if b - a < 5:
        a -= (5 - (b - a)) * 0.7; b = a + 5
    a, b = max(0, a), min(dur - 0.05, b)
    T = b - a
    h = 720 if H >= 720 else H - H % 2
    w = round(W * h / H / 2) * 2
    fs_en, fs_ru, fs_br = round(h * 0.062), round(h * 0.047), round(h * 0.03)
    o = (s.get('lang') == 'de' and f.get('de')) or f['en']
    ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {w}
PlayResY: {h}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: S,{FONT},{fs_en},&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,{max(2, round(h * 0.004))},{max(1, round(h * 0.002))},2,{round(w * 0.06)},{round(w * 0.06)},{round(h * 0.055)},1
Style: B,{FONT},{fs_br},&H40FFFFFF,&H40FFFFFF,&H80000000,&H00000000,1,0,0,0,100,100,0,0,1,1,0,9,{round(h * 0.03)},{round(h * 0.03)},{round(h * 0.03)},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,{ass_t(0)},{ass_t(T)},S,,0,0,0,,{esc(o)}\\N{{\\fs{fs_ru}\\b0\\c&H8FE3F3&}}{esc(x['ru'])}
Dialogue: 0,{ass_t(0)},{ass_t(T)},B,,0,0,0,,Языки по кино
"""
    with tempfile.NamedTemporaryFile('w', suffix='.ass', delete=False, encoding='utf-8') as fh:
        fh.write(ass); ap = fh.name
    vf = f"scale={w}:{h},subtitles={ap},fade=t=in:st=0:d=0.15,fade=t=out:st={max(0, T - 0.25):.2f}:d=0.25,format=yuv420p"
    af = f"afade=t=in:st=0:d=0.12,afade=t=out:st={max(0, T - 0.3):.2f}:d=0.3"
    cmd = ['ffmpeg', '-y', '-v', 'error', '-ss', '%.3f' % a, '-i', src, '-t', '%.3f' % T, '-vf', vf, '-af', af,
           '-c:v', 'libx264', '-preset', 'medium', '-crf', '25', '-profile:v', 'high', '-movflags', '+faststart',
           '-c:a', 'aac', '-b:a', '96k', '-ac', '2', out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    os.unlink(ap)
    print('%03d' % i, 'OK ' if r.returncode == 0 else 'ERR', '%.1fs' % T, '%dKB' % (os.path.getsize(out) // 1024 if os.path.exists(out) else 0), x['sid'], '|', o, r.stderr[-200:] if r.returncode else '')
