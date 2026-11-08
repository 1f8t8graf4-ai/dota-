# Тексты для ElevenLabs и описания к постам → eleven/<ep>.txt и eleven/ВСЕ-ТЕКСТЫ.md
#   python3 eleven.py
# В ElevenLabs: вставить текст ролика целиком, скачать mp3, затем
#   python3 voice.py <ep> --audio файл.mp3 && ./make.sh <ep>   (ролик пересоберётся под новый голос)
import os
from scripts import EPISODES, shown

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'eleven')
TITLE = {'mrbeast': 'What do you know about MrBeast?', 'nicotine': 'Что вы знаете о никотине / nicotine', 'aids': 'What do you know about AIDS?',
         'meph': 'Что вы знаете о мефедроне / mephedrone', 'nicstory': 'Макс и счётчик / Max and the counter', 'aidsmyth': '4 myths about HIV',
         'mephnight': 'Представь: суббота, 23:00 / Picture this', 'energy': 'What do you know about energy drinks?'}
DESC = {
    'mrbeast-en': 'MrBeast is technically the 3rd biggest country on Earth 🌍 #mrbeast #facts #didyouknow #youtube — parody / satire, not affiliated with MrBeast.',
    'nicotine-en': 'Nicotine was made to kill bugs 🐛 #nicotine #vape #facts #didyouknow #quitvaping',
    'nicotine-ru': 'Никотин придуман, чтобы убивать жуков 🐛 #никотин #вейп #факты #какбросить',
    'aids-en': 'The virus behind AIDS is about 100 years old. Get tested 🎗️ #hiv #aids #history #didyouknow #gettested',
    'meph-en': 'Mephedrone was sold as plant food 🌱 #drugawareness #facts #didyouknow — help: findahelpline.com',
    'meph-ru': 'Мефедрон продавали как удобрение для цветов 🌱 #факты #зависимость — помощь: 8-800-2000-122 (детский телефон доверия, бесплатно)',
    'nicstory-en': 'How long can Max go without nicotine? ⏱️ #quitvaping #nicotine #vape #story',
    'nicstory-ru': 'Сколько Макс может без никотина? ⏱️ #вейп #какбросить #никотин',
    'aidsmyth-en': '4 HIV myths + 1 thing almost nobody knows (PEP, 72 hours) — save this 🔖 #hiv #myths #pep #health',
    'mephnight-en': 'Picture this: Saturday, 11 PM 🕚 #drugawareness #story — help: findahelpline.com',
    'mephnight-ru': 'Представь: суббота, 23:00 🕚 #зависимость #история — помощь: 8-800-2000-122 (бесплатно, анонимно)',
    'energy-en': 'The bull in your energy drink is real (kind of) 🐂 #energydrink #facts #didyouknow',
}
os.makedirs(OUT, exist_ok=True)
md = ['# Тексты для ElevenLabs и описания к постам\n',
      'Как вставлять: один ролик — один текст целиком (как ниже). Голос — спокойный, «рассказчик за кадром», без эмоций в начале.',
      'После скачивания mp3: `python3 voice.py <ролик> --audio файл.mp3 && ./make.sh <ролик>` — картинка и субтитры встанут под новый голос.\n',
      'Помощь в описании: Германия — Sucht & Drogen Hotline 01806 313031; Россия — 8-800-2000-122 (детский телефон доверия); весь мир — findahelpline.com. Номера проверь перед публикацией.\n']
for ep, lines in EPISODES.items():
    base = ep.rsplit('-', 1)[0]
    txt = '\n'.join(shown(s) for _, s in lines)
    open(os.path.join(OUT, ep + '.txt'), 'w').write(txt + '\n')
    n = sum(len(shown(s)) for _, s in lines)
    md += [f'## {ep} — {TITLE.get(base, base)}', f'Знаков: {n}', '', '```', txt, '```', '', 'Описание: ' + DESC.get(ep, ''), '']
open(os.path.join(OUT, 'ВСЕ-ТЕКСТЫ.md'), 'w').write('\n'.join(md))
print('ok', len(EPISODES), 'роликов,', sum(sum(len(shown(s)) for _, s in L) for L in EPISODES.values()), 'знаков всего')
