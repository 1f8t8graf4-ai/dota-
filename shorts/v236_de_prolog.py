#!/usr/bin/env python3
"""v23.6 (23.11): немецкий (и английский — `python3 v236_de_prolog.py en`, голос Натан; Андрей, 23.11: «добро») пролог фильма «Was wisst ihr über Nikotin?» голосом Alexander (как главы 1–5 на немецком;
Андрей, 22.11: «делай немецкий язык даю добро»). Текст — v231_tl.py TXT['v231y']['de'].
Запись — один раз (готовое не перезаписывает) → voice/de/prolog.{mp3,align.json,json};
дальше — как у русского пролога: out/v233-de/{voice.wav,timeline.json} → v233_tl.main('de') → tl/v231y-de.json, tl/v231f-de.json.
   python3 v236_de_prolog.py"""
import base64, json, os, re, subprocess, sys
import numpy as np, requests, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, 'l10n'))
import v231_tl, v233_tl, dub
L = sys.argv[1] if len(sys.argv) > 1 else 'de'
B = os.path.join(HERE, 'voice', L, 'prolog'); SR = 44100


def rec():
    if os.path.exists(B + '.json'): print('уже записано:', B); return
    S = v231_tl.TXT['v231y'][L]; text = '\n\n'.join(S)
    body = {'text': text, 'model_id': dub.MODEL, 'language_code': L, 'voice_settings': dub.VSET}
    print(f'пролог {L}: {len(text)} знаков — пишу…')
    r = requests.post(f'{dub.API}/v1/text-to-speech/{dub.VOICE[L]}/with-timestamps?output_format=mp3_44100_128', headers=dub.H, json=body, timeout=600)
    if r.status_code != 200: raise SystemExit(f'ElevenLabs {r.status_code}: {r.text[:400]}')
    j = r.json(); open(B + '.mp3', 'wb').write(base64.b64decode(j['audio_base64']))
    json.dump(j['alignment'], open(B + '.align.json', 'w'), ensure_ascii=False)
    json.dump({'voice': dub.VOICE[L], 'model': dub.MODEL, 'settings': dub.VSET, 'text': text, 'sent': S}, open(B + '.json', 'w'), ensure_ascii=False, indent=1)


def src():   # как el13.build для русского: voice.wav + время слов по фразам
    meta = json.load(open(B + '.json')); al = json.load(open(B + '.align.json')); text = meta['text']
    C, A, E = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
    assert ''.join(C) == text
    sent, off = [], 0
    for i, s in enumerate(meta['sent']):
        k0 = text.index(s, off); off = k0 + len(s); W = []
        for m in re.finditer(r'\S+', s):
            ks = [k for k in range(k0 + m.start(), k0 + m.end()) if C[k].isalnum()]
            if ks: W.append({'d': m.group(), 'a': A[ks[0]], 'b': E[ks[-1]]})
        sent.append({'i': i, 'scene': f's{i + 1}', 'text': s, 'a': W[0]['a'], 'b': W[-1]['b'], 'words': W})
    o = os.path.join(HERE, 'out', f'v233-{L}'); os.makedirs(o, exist_ok=True)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', B + '.mp3', '-ar', str(SR), '-ac', '1', '-c:a', 'pcm_f32le', os.path.join(o, 'voice.wav')], check=True)
    json.dump({'sent': sent}, open(os.path.join(o, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    for s in sent: print(s['scene'], ' '.join(f"{w['d']}@{w['a']:.2f}" for w in s['words']))


if __name__ == '__main__':
    rec(); src(); v233_tl.main(L)
