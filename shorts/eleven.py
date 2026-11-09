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
         'mephnight': 'Представь: суббота, 23:00 / Picture this', 'energy': 'What do you know about energy drinks?',
         'tabak': 'Что вы знаете о табаке? (пилот v4)', 'nicw': 'Никотин 1 — «Что вы знаете о никотине?» один в один',
         'nicmax': 'Никотин 2 — как популярные: Макс и таймер', 'nictyaga': 'Никотин 3 — смесь: «Не закрывай» + таймер тяги',
         'nicme': 'Никотин 4 — свой: «Я — никотин»', 'nicw1': 'Никотин v6-1 — шизо: «одноразки придумала тля»',
         'nicw2': 'Никотин v6-2 — «Что вы знаете о никотине?», улучшенный', 'nicw3': 'Никотин v6-3 — одна камера и петля: никотин в баклажане'}
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
    'nicw1-ru': 'Тля мстит людям уже 300 лет 🐛🕵️ Это шутка: одноразки тля не придумывала, а все факты в ролике настоящие. #никотин #вейп #теориязаговора #факты — бросить: 8-800-200-0-200 (бесплатно)',
    'nicw2-ru': 'Табак отвечает на укусы — и ваш мозг тоже 🧠🐛 #никотин #вейп #факты #чтовызнаете — бросить: 8-800-200-0-200 (бесплатно)',
    'nicw3-ru': 'В баклажане есть никотин 🍆 Сколько нужно съесть на одну сигарету? #никотин #баклажан #факты #чтовызнаете — бросить: 8-800-200-0-200 (бесплатно)',
    'nicw-ru': 'В Евросоюзе никотином нельзя травить даже тлю 🐛 #никотин #вейп #факты #чтовызнаете — бросить: 8-800-200-0-200 (бесплатно)',
    'nicmax-ru': 'Сколько продержался бы ты? ⏱️ #вейп #одноразка #какбросить #никотин — бросить: 8-800-200-0-200 (бесплатно)',
    'nictyaga-ru': 'Тяга проходит за 3–5 минут. Посмотри 3 раза ⏳ #какбросить #вейп #никотин #бросилкурить — помощь: 8-800-200-0-200',
    'nicme-ru': 'Мне нужно 10 секунд 🧠 #никотин #вейп #мозг #факты — бросить: 8-800-200-0-200 (бесплатно)',
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
