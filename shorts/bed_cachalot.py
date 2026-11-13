# Пробный звук (13.11): голос + наши звуки + чужой трек под наш текст, нарезка по тактам.
# Трек в git не кладём — путь аргументом. Варианты: press — бас музыки прижат под голосом (по полосам),
# wall — под речью музыка «через стену» (без верхов), в паузах и на доске — целиком.
#   python3 bed_cachalot.py v165a-ru <трек.mp3> <папка_вывода>
import json, os, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import tt_audio  # noqa: E402

SR = 48000
# «cachalot (speed up)»: 104,25 BPM, доля 0,5755 с; удары баса на сильную долю — такт 9 (21,069 с) и такт 33 (76,321 с)
DROP1, DROP3 = 21.069, 76.321


def dec(path, ch=2, af=None):
    cmd = ['ffmpeg', '-v', 'error', '-i', path] + (['-af', af] if af else []) + ['-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-']
    b = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, ch).copy()


def enc(x, path):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', str(x.shape[1]), '-i', '-', '-c:a', 'pcm_s16le', path],
                   input=np.ascontiguousarray(x, np.float32).tobytes(), check=True)


def env(n, pts):
    T, G = zip(*sorted(pts))
    return np.interp(np.arange(n) / SR, T, G).astype(np.float32)


def place(dst, src, v0, v1, s0):
    # кусок трека с s0 — в ролик на [v0, v1)
    a, b, s = int(round(v0 * SR)), int(round(v1 * SR)), int(round(s0 * SR))
    b = min(b, len(dst), a + len(src) - s)
    if b > a:
        dst[a:b] += src[s:s + (b - a)]


def bed(T, full, muff, wall):
    S = T['sent']; DUR = T['dur']; n = int(round(DUR * SR))
    t_drop, q0, q1 = S[2]['a'], S[4]['a'], S[4]['b']
    t_conf, t_board, t_tak = S[14]['a'], S[15]['a'], S[16]['a']
    off = DROP1 - t_drop                                   # бас входит на «Вернёмся в 1973 год»
    A = np.zeros((n, 2), np.float32); Am = np.zeros_like(A); B = np.zeros_like(A); Bm = np.zeros_like(A)
    place(A, full, 0, t_conf + .1, off); place(Am, muff, 0, t_conf + .1, off)
    place(B, full, t_board - .02, t_tak + .2, DROP3 - (t_board - .02)); place(Bm, muff, t_board - .02, t_tak + .2, DROP3 - (t_board - .02))
    # громкость: вход, цитата записки (тише и глухо), уход перед «Признайтесь…», доска — с удара, «Так…» — тишина
    gA = env(n, [(0, 0), (.3, 1), (q0 - .3, 1), (q0, .22), (q1, .22), (q1 + .4, 1), (t_conf - .6, 1), (t_conf, 0), (DUR, 0)])
    gB = env(n, [(0, 0), (t_board - .02, 0), (t_board, 1), (t_tak - .05, 1), (t_tak + .12, 0), (DUR, 0)])
    mq = env(n, [(0, 0), (q0 - .3, 0), (q0, 1), (q1, 1), (q1 + .4, 0), (DUR, 0)])     # цитата — всегда глухо
    if wall:
        # речь до «Признайтесь» — музыка без верхов; паузы, вход и доска — целиком
        sp = np.zeros(n, np.float32)
        for s in S[:14]:
            for w in s['words']:
                sp[int(max(0, w['a'] - .08) * SR):int((w['b'] + .12) * SR)] = 1
        k = int(.12 * SR); sp = np.convolve(sp, np.ones(k, np.float32) / k, 'same')
        mq = np.maximum(mq, sp)
    mq = mq[:, None]
    return (A * (1 - mq) + Am * mq) * gA[:, None] + B * gB[:, None]


def mix(ep, track, out_dir, kind, bed_db=float(os.environ.get('BED_DB', -7)), lufs=-13.0):
    o = os.path.join(HERE, 'out', ep); T = json.load(open(os.path.join(o, 'timeline.json'))); DUR = T['dur']
    full = dec(track)
    muff = dec(track, af='lowpass=f=420,lowpass=f=420,volume=3dB')
    M = bed(T, full, muff, kind == 'wall')
    os.makedirs(out_dir, exist_ok=True)
    mw = os.path.join(out_dir, f'bed-{kind}.wav'); enc(M, mw)
    voice, sfx = os.path.join(o, 'voice.wav'), os.path.join(o, 'sfx.wav')
    Lv, _ = tt_audio._lufs(voice); Lm, _ = tt_audio._lufs(mw)
    g = Lv + bed_db - Lm
    f = ['[0:a]aresample=48000,aformat=channel_layouts=stereo,acompressor=threshold=0.06:ratio=3.5:attack=4:release=120:makeup=2.5,treble=g=-3:f=7000,asplit=3[voc][k1][k2]',
         f'[1:a]aformat=channel_layouts=stereo,volume={g:.2f}dB,acrossover=split=180[lo][hi]',
         # бас музыки уступает голосу, середина — слегка; голос: верха выше 7 кГц −3 дБ (он ярче, чем у референсов)
         f'[lo][k1]sidechaincompress=threshold=0.04:ratio={os.environ.get("LO_R", 2.5)}:attack=6:release=220[lod]',
         '[hi][k2]sidechaincompress=threshold=0.06:ratio=2:attack=10:release=260[hid]',
         '[lod][hid]amix=inputs=2:normalize=0[md]',
         {'': f'[voc][md][2:a]amix=inputs=3:normalize=0,apad,atrim=0:{DUR:.3f}[m]',   # STEM=voice|bed — для замеров: только голос или только музыка
          'voice': f'[voc]apad,atrim=0:{DUR:.3f}[m];[md]anullsink;[2:a]anullsink',
          'bed': f'[md]apad,atrim=0:{DUR:.3f}[m];[voc]anullsink;[2:a]anullsink'}[os.environ.get('STEM', '')]]
    raw = os.path.join(out_dir, f'mix-{kind}.raw.wav'); res = os.path.join(out_dir, f'mix-{kind}.wav')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', voice, '-i', mw, '-i', sfx, '-filter_complex', ';'.join(f), '-map', '[m]', '-ar', '48000', '-c:a', 'pcm_s16le', raw], check=True)
    L, _ = tt_audio._lufs(raw) if not os.environ.get('STEM') else (lufs, 0)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af', f'volume={lufs - L:.2f}dB,alimiter=limit=0.89:level=disabled', '-c:a', 'pcm_s16le', res], check=True)
    os.remove(raw)
    print(kind, 'музыка', f'{g:+.1f} дБ', 'итог', tt_audio.report(res))
    return res


if __name__ == '__main__':
    ep, track, out_dir = sys.argv[1:4]
    for kind in (sys.argv[4:] or ['press', 'wall']):
        mix(ep, track, out_dir, kind)
