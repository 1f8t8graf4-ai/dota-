#!/usr/bin/env python3
"""v19.4 (19.11): мостик «Льда» (v191y-ru) ныряет в кадр 0 главы 3 «1924 · Мальборо» (v200y-ru).
Рисовку главы мостик берёт у самой главы: stage.html для v191y грузит ep/v200.js (window.EP3) и её таймлайн ep/v200-tl.js (window.TL200).
Последний кадр мостика — кадр главы за 1/30 с до её кадра 0: камера на стыке не встаёт, кадры идут подряд.

  python3 v194_bridge.py tl      → ep/v200-tl.js из out/v200y-ru/timeline.json (после правки таймлайна главы 3)
  python3 v194_bridge.py sound   → out/v191y-ru/snd/sfx.wav и mix.wav (подложка Кашалота — прежняя out/v191y-ru/snd/bed.wav, трек не нужен),
                                   out/v191y-ru/final.mp4
  python3 v194_bridge.py seam    → стык: средняя разница соседних кадров 4 последних кадров мостика и 4 первых главы (скачка быть не должно)"""
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
OB, OC = os.path.join(HERE, 'out', 'v191y-ru'), os.path.join(HERE, 'out', 'v200y-ru')


def tl():
    src = os.path.join(OC, 'timeline.json')
    if not os.path.exists(src): src = os.path.join(HERE, 'tl', 'v200y-ru.json')
    t = json.load(open(src)); t.setdefault('ep', 'v200y-ru')
    with open(os.path.join(HERE, 'ep', 'v200-tl.js'), 'w') as f:
        f.write('// таймлайн главы 3 (фильм) для мостика «Льда» — python3 v194_bridge.py tl\nwindow.TL200 = ' + json.dumps(t, ensure_ascii=False) + ';\n')
    print('ep/v200-tl.js', t['dur'])


def sound():
    import mix193 as M
    import v165_sound as VS
    from v180_sound import sfx_track
    T = json.load(open(os.path.join(OB, 'timeline.json'))); dur = np.ceil(T['dur'] * 30) / 30
    od = os.path.join(OB, 'snd'); sw = os.path.join(od, 'sfx.wav'); bw = os.path.join(od, 'bed.wav')
    if not os.path.exists(bw): sys.exit('нет out/v191y-ru/snd/bed.wav — подложку «Льда» собрать: python3 mix193.py v191y-ru <трек Кашалота>')
    VS.wav(sfx_track(json.load(open(os.path.join(OB, 'cues.json'))), dur), sw)
    M.final(os.path.join(OB, 'voice.wav'), sw, bw, os.path.join(od, 'mix.wav'), dur)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(OB, 'video.mp4'), '-i', os.path.join(od, 'mix.wav'), '-map', '0:v', '-map', '1:a',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', os.path.join(OB, 'final.mp4')], check=True)
    print('out/v191y-ru/final.mp4')


def frames(path, first, n):
    nb = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout)
    a = max(0, nb - n) if not first else 0
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'select=between(n\\,{a}\\,{a + n - 1}),scale=540:960', '-vsync', '0', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, 960, 540, 3).astype(np.float32), nb


def seam():
    B, nb = frames(os.path.join(OB, 'video.mp4'), False, 4); C, _ = frames(os.path.join(OC, 'video.mp4'), True, 4)
    F = list(B) + list(C); d = [float(np.abs(F[i + 1] - F[i]).mean()) for i in range(len(F) - 1)]
    print(f'мостик: {nb} кадров; разница соседних кадров (стык — между 4-м и 5-м):', ' '.join(f'{x:.2f}' for x in d))
    s = d[3]; nb2 = d[:3] + d[4:]
    print('стык', 'ровный' if s <= 1.5 * max(nb2) and s >= .5 * min(nb2) else 'СКАЧОК', f'({s:.2f} при соседних {min(nb2):.2f}…{max(nb2):.2f})')


if __name__ == '__main__':
    {'tl': tl, 'sound': sound, 'seam': seam}[sys.argv[1] if len(sys.argv) > 1 else 'seam']()
