# ОТЧЁТ-ZAI-dd-ult-wt — точное время слов в 422 ульт-репликах (03.11, Зетка)

Ветка `zai/dd-ult-wt`, файл `data/dd-ult-wt.json`. Код сайта не трогала — сайт уже умеет читать этот файл.

## Что сдано

- `data/dd-ult-wt.json`: **422 записи**, ключ — URL **ровно как поле `a` в `data/dd-ult.json`** (сверено: 0 лишних, 0 пропавших);
- значение: `[[начало, конец, "слово"], …]` — слова из поля `en` реплики по пробелам, знаки при слове, время по возрастанию (проверено: не-возрастания нет нигде);
- всего 2 113 слов, из них **1 928 (91,2 %) — время из распознавания голоса**, остальные 185 — интерполяция между соседними (список ниже).

## Как делала

- **Источник звука.** `deadlock.wiki` из песочницы закрыт Cloudflare-челленджем (403 «Just a moment…» на все запросы, браузерные заголовки не помогают). Взяла **те же файлы с CDN deadlock-api**: индекс `/v1/assets/sounds` (130 814 звуков) — все 422 нашлись 1:1 по внутреннему имени игры (`atlas use power4 01` → `vo/atlas/atlas_use_power4_01.mp3`). Это те же игровые реплики, что лежат на вики; доказательство совпадения — 91 % слов распознавания совпали с нашими текстами `en`.
- **Распознавание:** faster-whisper, `word_timestamps=True`, без VAD, вход — ffmpeg 16 кГц моно (как в `zai/dd-wt`).
- **Модели — честно:** первые 240 реплик — **medium.en (int8)**, оставшиеся 182 — **small.en (int8)**: в песочнице 3 ГБ RAM, medium.en при повторной загрузке убивался SIGKILL'ом (OOM). На коротких чистых VO тайминги word_timestamps у них совпадают в пределах ±0,05 с (проверено на 10 дублях до смены модели — шла на medium, текст один, время то же). Текст всегда наш, из `en` — от модели берётся только время.
- **Выравнивание** — та же логика, что в моём `zai/dd-wt` (`tools/dd_wt_build.py`): сопоставление по порядку без регистра и знаков (difflib), дыры поровну между соседними найденными.

## Проверка

- **10 случайных реплик числово** (не ушами — в песочнице нет звука): монотонность 10/10, слова в границах файла 10/10 (ffprobe-длительность), крайние случаи ±0,15 с соблюдены;
- сверка слов с паузами (`silencedetect -30дБ`): реплики сплошные, разрывов > 0,3 с почти нет — метод не информативен на этих роликах, итог по нему не считала;
- **±0,15 с на слух проверить не могу** — прошу Клауда или Андрея: открыть любого героя на сайте (файл подхватится из main) и послушать 2–3 реплики.

## Где угадывала (116 реплик, 185 слов)

В основном: смех («Ahahahahaha!» — whisper не членит), короткие возгласы («Go!», «Die!»), слова с апострофами («Droppin' in.»), названия («Ixia», «crumbums»). Интерполяция стоит между правильно распознанными соседями — время рамочное, не случайное.

| герой | реплика | слов из голоса |
|---|---|---|
| abrams | Going up! | 1/2 |
| abrams | Droppin' in. | 1/2 |
| abrams | Ahahahahaha! | 0/1 |
| abrams | Ahahahahaha! | 0/1 |
| apollo | I'm a proud son of Ixia! | 5/6 |
| bebop | Hyper Beam online. | 0/3 |
| bebop | Using Hyper Beam. | 1/3 |
| bebop | Laser's running hot! | 2/3 |
| bebop | I'll cut through all of ya! | 5/6 |
| bebop | Laser's hot! | 0/2 |
| bebop | Blastin' 'em! | 0/2 |
| bebop | Urgh, here we go! | 3/4 |
| bebop | I, for one, am looking forward to proving I'm better than Lash! | 9/12 |
| billy | Chained ‘em! | 0/2 |
| billy | Let’s dance! | 1/2 |
| billy | The party’s here, pal. | 3/4 |
| billy | I’ll grab ‘em! | 1/3 |
| billy | Don’t go runnin’ off on me! | 4/6 |
| billy | Where you think you're goin'? | 4/5 |
| billy | Those chumps think they can beat us? | 6/7 |
| billy | They gonna wish they never stepped foot in New York. | 9/10 |
| calico | Adieu. (Goodbye.) | 0/2 |
| celeste | So, you guys go to Coney a lot? | 7/8 |
| deadman-danny | Be earthbound no more with the Chimera Mark 1! | 6/9 |
| deadman-danny | If I die, let it be flying the Chimera Mark 1! | 9/11 |
| deadman-danny | Don’t let your last breath be on the ground! Get the Chimera Mark 1 to | 13/15 |
| deadman-danny | If anyone needs some reading material, I have got enough Fairfax catal | 14/15 |
| doorman | I’ll take you to your room. | 5/6 |
| drifter | On the prowl. | 2/3 |
| drifter | Stalkin' them! | 1/2 |
| drifter | They'll never survive, heheheh... | 3/4 |
| dynamo | I'll hold 'em as long as I can! | 7/8 |
| dynamo | I'm doin' it! | 1/3 |
| dynamo | Nooow! | 0/1 |
| dynamo | I think today is gonna be a great opportunity for personal growth. | 11/12 |
| grey-talon | Let them run. It will not save them. | 7/8 |
| haze | It's my time! | 2/3 |
| haze | You'll all pay. | 2/3 |
| holliday | I got 'em. | 2/3 |
| holliday | Will someone shoot 'em already?! | 4/5 |
| holliday | Wrangling 'em! | 0/2 |
| holliday | I'll draggin' 'em! | 0/3 |
| holliday | Got 'em roped up! | 3/4 |
| holliday | I got 'em! | 2/3 |
| holliday | Gimme a hand! | 2/3 |
| holliday | Simple plan. I grab 'em, you shoot 'em. | 6/8 |
| holliday | Let's just summon the damn patron and get outta here! | 9/10 |
| infernus | I'm goin' in! | 2/3 |
| infernus | Take 'em down! | 2/3 |
| infernus | I'll stun 'em! | 2/3 |
| ivy | Woooo! | 0/1 |
| ivy | Woooo! | 0/1 |
| ivy | ¡No voy a morir aquí! (I'm not going to die here!) | 1/11 |
| ivy | Stick close to me, I'll do my best to protect you. | 10/11 |
| kelvin | I won't meet my final debt! | 5/6 |
| kelvin | Dome's up! | 1/2 |
| lady-geist | You all make suitable pawns. | 4/5 |
| lash | Alright, I'm done playin' with you. | 5/6 |
| lash | I got 'em! | 2/3 |
| lash | I got 'em. | 2/3 |
| lash | Grabbin' em! | 0/2 |
| lash | I hope you're all ready to watch the god of combat do his thing. | 13/14 |
| mcginnis | I'll give 'em hell! | 3/4 |
| mcginnis | Going hot! | 1/2 |
| mcginnis | [Sigh] let's go, baby! | 3/4 |
| mcginnis | Just wanna get ahead of this: I will probably misuse the wall at some  | 19/20 |
| mina | [Laughter] | 0/1 |
| mirage | I move at your whims, Nashala. | 5/6 |
| mirage | The Djinn take me where I'm needed. | 6/7 |
| mirage | This isn't over, my friend. | 4/5 |
| mo-krill | Get them, Maurice! | 2/3 |
| mo-krill | We got 'em! | 2/3 |
| mo-krill | Take care of them, Maurice! | 4/5 |
| mo-krill | Get 'em, Mo! | 2/3 |
| mo-krill | I don't expect any of you are familiar with Mole-Man etiquette. | 9/11 |
| nurse-harrow | Flee! | 0/1 |
| nurse-harrow | Cowards! | 0/1 |
| nurse-harrow | Tremble as they trembled. | 3/4 |
| nurse-harrow | Begone! | 0/1 |
| nurse-harrow | Leave! | 0/1 |
| nurse-harrow | You are all under my care. | 5/6 |
| paige | Please? Help me, Bors! | 3/4 |
| rat-king | Let's roll boys! | 2/3 |
| rat-king | It's our time now, baby! | 4/5 |
| rat-king | It's crumbum huntin' season. | 2/4 |
| rat-king | Show 'em no mercy! | 3/4 |
| rat-king | We're running wild, baby! | 3/4 |
| rat-king | We're not givin' up! | 3/4 |
| rat-king | Alright, crumbums! Let's kill those other crumbums. | 5/7 |
| rem | Night-night. | 0/1 |
| rem | Bed now! | 1/2 |
| seven | I am your end! | 1/4 |
| shiv | I'm gonna stab a whole lotta people today. | 7/8 |
| shiv | They're gonna regret pickin' a fight with the Baxter Society. | 9/10 |
| silver | You're not givin' me any choice! | 5/6 |
| silver | Alright. Let's see who I have to work with here. | 9/10 |
| silver | Guys, take a look at who we're fightin'. We shouldn't have much of a p | 14/15 |
| solomon | Long may she reign. | 2/4 |
| solomon | She has come to... deliver us. | 5/6 |
| solomon | She has come to deliver us! | 5/6 |
| solomon | I'm lookin' forward to workin' with all of you. | 6/9 |
| solomon | A little bit of nerves are good for ya. It means... you're invested. | 12/13 |
| venator | In nomine Patris, et Filii, et Spiritus Sancti. (In the name of the Fa | 5/20 |
| venator | Domine, protege me, dum impios interficio. (Lord, protect me while I k | 0/14 |
| victor | I'm reborn! | 1/2 |
| viscous | Weeee! | 0/1 |
| viscous | Byyyye! | 0/1 |
| viscous | Byeeee! | 0/1 |
| vyper | I'll turn them to stone. | 4/5 |
| vyper | Throwing bola! | 0/2 |
| vyper | This will take 'em out. | 2/5 |
| vyper | The old gorgon special. | 3/4 |
| vyper | Look at those chumps over there, no way we lose to them. | 11/12 |
| wraith | Locking them down. | 1/3 |
| wraith | I got 'em. | 2/3 |
| wraith | We gotta take 'em out or I'm dead. | 7/8 |
## Хвосты

- Два файла при первом прогоне падали с ошибкой PyAV (`open() got an unexpected keyword argument 'metadata_errors'` — в песочнице был av 19.x) — откатила на `av==12.3.0`, после чего распознались все 422.
- Скрипты: скачивание `ult_download.py`, whisper `ult_whisper.py` (с докачкой/резюмом по `wt-raw.json`), сборка `ult_build.py` — в `/home/z/my-project/scripts/` вне репо; сырьё (wav + сырые тайминги) в `/tmp/ult-audio/` — переживает до конца сессии, если Клауду понадобится пересборка.
