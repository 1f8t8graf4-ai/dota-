# -*- coding: utf-8 -*-
# Полный тест-видос «как в примере из ТТ» (Зетка, 05.11; Андрей: «полностью видос тестовый посмотрю как будет»)
# История (текст ниже) → нейроголос Пайпер (локальный, бесплатно) → караоке-сабы по таймингам whisper
# → атмосферные арты из heroes-16x9 с зумом, виньеткой и зерном → вертикальный 1080×1920 в Downloads.
#   python tools/story_video.py                    # тестовая история (Дедлок, арты героев)
#   python tools/story_video.py story.txt          # свой текст
#   python tools/story_video.py story.txt img.txt  # + свои картинки (URL или пути, по одной на бит)
import json, os, subprocess, sys, tempfile, urllib.request, wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = os.path.join(os.environ.get('TEMP', tempfile.gettempdir()), 'ru_RU-dmitri-medium.onnx')
ARTS = ['vindicta', 'wraith', 'lady-geist', 'shiv', 'seven', 'viscous', 'warden', 'paradox']
FPS, W, H = 30, 1080, 1920
YELLOW, DIM = '&H004DE5FF', '&H60FFFFFF'
STORY = ('В три часа ночи сервер Дедлока не спал. Матч закончился ещё в двенадцать. Все вышли. '
         'Все, кроме одного игрока. Он написал в чат: не уходите, тут кто-то есть. '
         'Ему ответили: ты один на сервере. Тогда кто стоит у моста? '
         'Игра показывала одиннадцать игроков. Но все ники были пустыми. Просто прочерки. '
         'Он попробовал выйти. Кнопка не работала. Табло написало: матч не закончен. '
         'Утром его друг открыл спектатора. Игрок всё ещё стоял на базе. Он не двигался. '
         'Только иногда писал в чат одно и то же слово. Выйдите. '
         'Если вы играете ночью и счёт вдруг завис — не перезаходите. Некоторые матчи не хотят заканчиваться.')

def sh(*a, cwd=None):
    r = subprocess.run(list(a), capture_output=True, text=True, cwd=cwd)
    if r.returncode: raise RuntimeError(' '.join(a[:2]) + ': ' + r.stderr[-400:])
    return r.stdout

def synth(text, wav):
    import piper
    v = piper.PiperVoice.load(VOICE)
    w = wave.open(wav, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(v.config.sample_rate)
    for sent in [s.strip() for s in text.replace('!', '.').replace('?', '.').split('.') if s.strip()]:
        for ch in v.synthesize(sent): w.writeframes(ch.audio_int16_bytes)
        import time as _t; w.writeframes(b'\x00' * int(v.config.sample_rate * 0.28) * 2)
    w.close()
    return wav

def timings(wav):
    from faster_whisper import WhisperModel
    import numpy as np
    # PyAV в этой среде битый (metadata_errors) — кормим whisper массивом из wav напрямую (как dd_wt)
    w = wave.open(wav); raw = w.readframes(w.getnframes()); fr = w.getframerate(); w.close()
    audio = np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0
    m = WhisperModel('tiny', device='cpu', compute_type='int8')
    segs, info = m.transcribe(audio, language='ru', word_timestamps=True, vad_filter=False)
    words = []
    for s in segs:
        for wd in (s.words or []): words.append([round(wd.start, 2), round(wd.end, 2), wd.word.strip()])
    return [w for w in words if w[2]]

def ass_t(t): return f'{int(t//3600)}:{int(t%3600//60):02d}:{t%60:05.2f}'

def build_ass(path, words, total):
    kar, last = [], 0.0
    for s, e, wd in words:
        if s > last: kar.append('{\\k%d} ' % round((s - last) * 100))
        kar.append('{\\k%d}%s ' % (round((e - s) * 100), wd.replace('{', '(').replace('}', ')')))
        last = e
    head = ("""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: RU,Arial Black,60,%s,%s,&H00000000,&H96000000,-1,0,1,4,2,2,70,70,430,2048

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""" % (YELLOW, DIM))
    open(path, 'w', encoding='utf-8').write(
        head + f'Dialogue: 0,0:00:00.20,{ass_t(total)},RU,,0,0,0,,' + ''.join(kar).strip() + '\n')

def main():
    tmp = tempfile.mkdtemp(prefix='story_')
    text = open(sys.argv[1], encoding='utf-8').read() if len(sys.argv) > 1 else STORY
    wav = synth(text, os.path.join(tmp, 'voice.wav'))
    words = timings(wav)
    total = float(sh('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav).strip())
    print(f'голос {total:.0f} с, слов {len(words)}')

    aud = os.path.join(tmp, 'a.m4a')
    sh('ffmpeg', '-y', '-v', 'error', '-i', wav, '-af', 'loudnorm=I=-16:TP=-1.5', '-ar', '44100',
       '-c:a', 'aac', '-b:a', '128k', aud)

    # картинки: свой список (URL/пути) или арты героев из ветки
    parts = []
    srcs = [l.strip() for l in open(sys.argv[2], encoding='utf-8') if l.strip()] if len(sys.argv) > 2 else None
    cnt = len(srcs) if srcs else len(ARTS)
    d = (total + 1.0) / cnt
    for i in range(cnt):
        if srcs:
            s = srcs[i]
            img = os.path.join(tmp, f'a{i}' + os.path.splitext(s)[1])
            if s.startswith('http'):
                req = urllib.request.Request(s, headers={'User-Agent': 'Mozilla/5.0'})
                open(img, 'wb').write(urllib.request.urlopen(req, timeout=30).read())
            else:
                img = s
        else:
            r = subprocess.run(['git', 'show', f'origin/claude/hero-16x9:heroes-16x9/{ARTS[i]}.jpg'],
                               capture_output=True, cwd=ROOT)
            if r.returncode: sys.exit(f'нет арта {ARTS[i]}')
            img = os.path.join(tmp, f'a{i}.jpg'); open(img, 'wb').write(r.stdout)
        z = f"1+{0.12*round(d*FPS)}/on" if i % 2 == 0 else f"1.12-{0.12*round(d*FPS)}/on"
        vf = (f"scale={W*2}:{H*2}:force_original_aspect_ratio=increase,crop={W*2}:{H*2},"
              f"zoompan=z='{z}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={round(d*FPS)}:s={W}x{H}:fps={FPS},"
              f"eq=saturation=0.65:contrast=1.06,vignette=PI/4.2,noise=alls=5:allf=t,"
              f"fade=t=in:st=0:d=0.25,fade=t=out:st={d-0.25:.2f}:d=0.25")
        seg = os.path.join(tmp, f's{i}.mp4')
        sh('ffmpeg', '-y', '-v', 'error', '-loop', '1', '-i', img, '-vf', vf,
           '-frames:v', str(round(d * FPS)), '-pix_fmt', 'yuv420p', '-r', str(FPS), seg)
        parts.append(seg)
    vtxt = os.path.join(tmp, 'v.txt')
    open(vtxt, 'w').write('\n'.join(f"file '{p}'" for p in parts) + '\n')

    build_ass(os.path.join(tmp, 'subs.ass'), words, total + 1.0)
    stem = os.path.splitext(os.path.basename(sys.argv[1]))[0] if len(sys.argv) > 1 else 'тест-история-дедлок'
    out = os.path.join(os.path.expanduser('~'), 'Downloads', stem + '.mp4')
    cwd = os.getcwd(); os.chdir(tmp)
    try:
        sh('ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', 'v.txt', '-i', 'a.m4a',
           '-vf', 'ass=subs.ass', '-c:v', 'libx264', '-preset', 'fast', '-crf', '21',
           '-c:a', 'aac', '-shortest', '-movflags', '+faststart', out)
    finally:
        os.chdir(cwd)
    print('готово:', out, f'{os.path.getsize(out)//1024} КБ')

if __name__ == '__main__':
    main()
