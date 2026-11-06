# -*- coding: utf-8 -*-
# Конвейер вертикальных роликов «герой говорит» (Зетка, 05.11 ночь; Андрей: «лан делай конвейер»)
# Один прогон: реплики героя (реальная озвучка из R2) + караоке-сабы по таймингам слов (dd-wt.json)
# + арт героя с медленным зумом → вертикальный 1080×1920 mp4 в Downloads.
#   python tools/conveyor.py rem          # 8 реплик
#   python tools/conveyor.py rem 5        # пять реплик
# ElevenLabs дальше: synth(text) — когда будет ключ (файл .eleven-key в корне, НЕ в чате и НЕ в репо),
# тем же конвейером озвучиваем любой сценарий, караоке — таймингами из whisper.
import json, os, subprocess, sys, tempfile, urllib.request

HERO = sys.argv[1] if len(sys.argv) > 1 else 'rem'
N = int(sys.argv[2]) if len(sys.argv) > 2 else 8
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R2 = 'https://dota.1f8t8graf4.workers.dev/m/'
UA = {'User-Agent': 'Mozilla/5.0'}
FPS, W, H, GAP = 30, 1080, 1920, 0.6
YELLOW = '&H004DE5FF'   # BGR: сказанное слово загорается жёлтым (как в tt_lines)
DIM = '&H60FFFFFF'

def sh(*a, **kw):
    r = subprocess.run(list(a), capture_output=True, text=True, **kw)
    if r.returncode: raise RuntimeError(' '.join(a[:2]) + ': ' + r.stderr[-400:])
    return r.stdout

def lines_of(hero):
    # games-new.json живёт в ветке zai/dd-wt (в main пока нет) — читаем git show, кешируем в TEMP
    cache = os.path.join(tempfile.gettempdir(), 'games-new.json')
    if not os.path.exists(cache) or os.path.getsize(cache) < 100:
        open(cache, 'wb').write(subprocess.run(['git', 'show', 'origin/zai/dd-wt:data/games-new.json'],
                                               capture_output=True, cwd=ROOT).stdout)
    g = json.load(open(cache, encoding='utf-8'))
    h = (g.get('heroes') or {}).get(hero)
    if not h: sys.exit(f'нет героя {hero}; есть: {", ".join(g["heroes"])}')
    return h.get('name', hero), h['lines'][:N]

def fetch(url, dst):
    if not os.path.exists(dst) or os.path.getsize(dst) < 200:
        req = urllib.request.Request(url, headers=UA)
        open(dst, 'wb').write(urllib.request.urlopen(req, timeout=30).read())
    return dst

def art_of(dst):
    # полноразмерный арт героя (2560×1440) — ветка claude/hero-16x9 (свой источник, API deadlock-api упал 05.11)
    r = subprocess.run(['git', 'show', f'origin/claude/hero-16x9:heroes-16x9/{HERO}.jpg'],
                       capture_output=True, cwd=ROOT)
    if r.returncode == 0 and len(r.stdout) > 10000:
        open(dst, 'wb').write(r.stdout); return dst
    sys.exit(f'нет арта {HERO}.jpg в claude/hero-16x9')

def dur(f):
    return float(sh('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f).strip())

def ass_t(t):
    return f'{int(t//3600)}:{int(t%3600//60):02d}:{t%60:05.2f}'

def build_ass(path, evs):
    head = ("""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: EN,Arial Black,58,%s,%s,&H00000000,&H96000000,-1,0,1,4,2,2,60,60,560,2048
Style: RU,Arial,44,&H00FFFFFF,%s,&H00000000,&H96000000,0,0,1,3,2,2,60,60,140,2048

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""" % (YELLOW, DIM, DIM))
    rows = []
    for t0, t1, en_words, ru in evs:
        # EN караоке: \k в сотых секунды — слова загораются жёлтым по таймингам dd-wt.json
        kar, last = [], 0.0
        for s, e, w in en_words:
            if s > last: kar.append('{\\k%d} ' % round((s - last) * 100))
            kar.append('{\\k%d}%s ' % (round((e - s) * 100), w.replace('{', '(').replace('}', ')')))
            last = e
        rows.append(f'Dialogue: 0,{ass_t(t0 + 0.15)},{ass_t(t1)},EN,,0,0,0,,' + ''.join(kar).strip())
        # RU — перевод появляется чуть позже и висит до конца реплики
        rows.append(f'Dialogue: 0,{ass_t(t0 + 0.35)},{ass_t(t1 + 0.2)},RU,,0,0,0,,{ru}')
    open(path, 'w', encoding='utf-8').write(head + '\n'.join(rows) + '\n')

def main():
    tmp = tempfile.mkdtemp(prefix='conv_')
    name, lines = lines_of(HERO)
    wt = json.load(open(os.path.join(ROOT, 'data', 'dd-wt.json'), encoding='utf-8'))
    segs, evs, parts, t = [], [], [], 0.0
    for L in lines:
        mp3 = fetch(R2 + L['a'], os.path.join(tmp, os.path.basename(L['a'])))
        words = wt.get(L['a'])
        if not words: sys.exit(f'нет таймингов для {L["a"]} в dd-wt.json')
        d = dur(mp3)
        segs.append((mp3, d)); evs.append((t, t + d, words, L['ru'])); t += d + GAP
    print(f'{name}: {len(segs)} реплик, {t - GAP:.0f} с')

    art = art_of(os.path.join(tmp, 'art.png'))
    for i, (mp3, d) in enumerate(segs):
        z = f"1+{0.10*round(d*FPS)}/on" if i % 2 == 0 else f"1.10-{0.10*round(d*FPS)}/on"
        vf = (f"scale={W*2}:{H*2}:force_original_aspect_ratio=increase,crop={W*2}:{H*2},"
              f"zoompan=z='{z}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={round(d*FPS)}:s={W}x{H}:fps={FPS}")
        seg = os.path.join(tmp, f'seg{i}.mp4')
        sh('ffmpeg', '-y', '-v', 'error', '-loop', '1', '-i', art, '-vf', vf,
           '-frames:v', str(round(d * FPS)), '-pix_fmt', 'yuv420p', seg)
        parts.append(seg)

    sil = os.path.join(tmp, 'gap.m4a')
    sh('ffmpeg', '-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', str(GAP),
       '-c:a', 'aac', sil)
    alst, vlst = [], []
    for i, (mp3, d) in enumerate(segs):
        alst.append(f"file '{mp3}'")
        if i < len(segs) - 1: alst.append(f"file '{sil}'")
        vlst.append(f"file '{parts[i]}'")
    open(os.path.join(tmp, 'a.txt'), 'w').write('\n'.join(alst) + '\n')
    open(os.path.join(tmp, 'v.txt'), 'w').write('\n'.join(vlst) + '\n')
    aud = os.path.join(tmp, 'a.m4a')
    sh('ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', os.path.join(tmp, 'a.txt'),
       '-c:a', 'aac', '-b:a', '128k', aud)

    build_ass(os.path.join(tmp, 'subs.ass'), evs)
    out = os.path.join(os.path.expanduser('~'), 'Downloads', f'{HERO}-говорит.mp4')
    cwd = os.getcwd(); os.chdir(tmp)   # фильтр ass= не любит «C:\…» — работаем отн. путями
    try:
        sh('ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', 'v.txt', '-i', 'a.m4a',
           '-vf', 'ass=subs.ass', '-c:v', 'libx264', '-preset', 'fast', '-crf', '20',
           '-c:a', 'aac', '-movflags', '+faststart', out)
    finally:
        os.chdir(cwd)
    print('готово:', out, f'{os.path.getsize(out)//1024} КБ, {dur(out):.1f} с')

if __name__ == '__main__':
    main()
