#!/usr/bin/env python3
"""Распознать речь в видео со словами и таймингами (Whisper). 12.7.
pip install faster-whisper   # модели качаются с Hugging Face в <папка>/w/models
Запуск: python3 tools/transcribe_whisper.py <рабочая папка> <list.tsv: ключ<TAB>путь к видео> [medium.en|large-v3]
Результат: <рабочая папка>/w/<ключ>.json — сегменты {a,b,t,w:[[начало,конец,слово,вероятность]]}.
Аудио подаётся через ffmpeg (у PyAV в контейнере не та версия для faster-whisper)."""
import sys,json,os,time,subprocess
import numpy as np
from faster_whisper import WhisperModel
SP=sys.argv[1]; pairs=[l.rstrip('\n').split('\t') for l in open(sys.argv[2]) if l.strip()]
m=WhisperModel(sys.argv[3] if len(sys.argv)>3 else 'medium.en',device='cpu',compute_type='int8',download_root=SP+'/w/models',cpu_threads=4)
for key,src in pairs:
    out=f'{SP}/w/{key}.json'
    if os.path.exists(out):continue
    t=time.time()
    raw=subprocess.run(['ffmpeg','-v','error','-i',src,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
    audio=np.frombuffer(raw,np.int16).astype(np.float32)/32768.0
    segs,info=m.transcribe(audio,language='en',beam_size=5,word_timestamps=True,condition_on_previous_text=False,vad_filter=True)
    S=[{'a':round(s.start,2),'b':round(s.end,2),'t':s.text.strip(),'w':[[round(w.start,2),round(w.end,2),w.word.strip(),round(w.probability,2)] for w in (s.words or [])]} for s in segs]
    json.dump({'src':src,'dur':info.duration,'segs':S},open(out,'w'),ensure_ascii=False)
    print(key,round(info.duration),'s in',round(time.time()-t),'s',flush=True)
