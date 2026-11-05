#!/usr/bin/env python3
"""Разбор (коуч) на ?lang=en: долить ключи en.json.
Ключи — как их видит движок lg32 t32x ПОСЛЕ подстановки чисел (#) и имён (*).
Существующие ключи не трогаем (кроме явной правки '#-й')."""
import io, json, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

P = 'restless/i18n/en.json'
D = json.load(open(P, encoding='utf-8'))
before = len(D)

ADD = {
  # шапка
  "из 10": "out of 10",
  "Победа, #/#.": "Win, #/#.",
  "Поражение, #/#.": "Loss, #/#.",
  # картина игры: линия
  "Линию против * ты выиграл": "You won the lane vs *",
  "Линию против * ты проиграл": "You lost the lane vs *",
  "Линию против * ты отстоял почти в ноль": "You held the lane vs * almost even",
  "# душ к #-й минуте против #, # уровень против #, ни одной смерти.": "# souls by minute # vs #, level # vs #, no deaths.",
  "# душ к #-й минуте против #, # уровень против #, # смерть на линии.": "# souls by minute # vs #, level # vs #, # death in lane.",
  "# душ к #-й минуте против #, # уровень против #, # смерти на линии.": "# souls by minute # vs #, level # vs #, # deaths in lane.",
  "# душ к #-й минуте против #, # уровень против #, # смертей на линии.": "# souls by minute # vs #, level # vs #, # deaths in lane.",
  "# душ к #-й минуте против #, ни одной смерти.": "# souls by minute # vs #, no deaths.",
  "# душ к #-й минуте против #, # смерть на линии.": "# souls by minute # vs #, # death in lane.",
  "# душ к #-й минуте против #, # смерти на линии.": "# souls by minute # vs #, # deaths in lane.",
  "# душ к #-й минуте против #, # смертей на линии.": "# souls by minute # vs #, # deaths in lane.",
  "Но по героям на линии ты почти не стрелял": "But you barely shot at heroes in lane",
  "# урона до #-й минуты при # в среднем у команды.": "# damage before minute # against the team average of #.",
  "К #-й минуте у тебя # душ — #-й результат в команде.": "By minute # you had # souls — #th on your team.",
  "Крипов добил #% из возможных — лучше, чем в среднем у команды (#%).": "Last hits: #% of possible — better than the team average (#%).",
  "Фарм не проблема.": "Farming is not the problem.",
  "Душ в минуту — #, #-й из 12.": "Souls per minute — #, #th of 12.",
  # оценка
  "# из # против # других игроков матча": "# out of # against the # other players in the match",
  "оценка # из # против лобби": "score # of # vs the lobby",
  # кто бил (боксы)
  "Кто тебя бил · #k урона": "Who hit you · #k damage",
  "оружие #%": "weapon #%",
  "умения и предметы #%": "abilities and items #%",
  "оружие.": "weapon.",
  "умения и предметы.": "abilities and items.",
  "умения, *": "abilities, *",
  "умения, оружие": "abilities, weapon",
  "от *": "from *",
  "#, в основном умения": "#, mostly abilities",
  "#, в основном оружие": "#, mostly weapon",
  "#, в основном умения и *": "#, mostly abilities and *",
  "#, в основном оружие и *": "#, mostly weapon and *",
  "#, в основном умения и *; дальше *": "#, mostly abilities and *; then *",
  "#, в основном оружие и *; дальше *": "#, mostly weapon and *; then *",
  "#, в основном умения; дальше *": "#, mostly abilities; then *",
  "#, в основном оружие; дальше *": "#, mostly weapon; then *",
  "#. #% урона по тебе": "#. #% of your damage taken",
  "#% урона по тебе": "#% of your damage taken",
  "#% урона по тебе — умения и предметы.": "#% of your damage taken — abilities and items.",
  "#% урона по тебе — оружие.": "#% of your damage taken — weapon.",
  # драки
  "Драки · был рядом в # из #": "Fights · there in # of #",
  "# · # · ты погиб": "# · # · you died",
  "зелёная — выиграли, красная — проиграли, бледная — тебя не было рядом; ✕ — ты погиб, «#-й» — погиб первым. Выиграли # из #, где ты был.": "green — won, red — lost, faded — you weren't there; ✕ — you died, «#» — died first. You won # of # you were in.",
  "Линия к # · против *": "Lane at # · vs *",
  "крупно — ты, мелко — соперник": "big — you, small — the opponent",
  # честно о картине
  "В # из # драк ты был рядом": "You were there in # of # fights",
  "это хорошо, не теряй это.": "that's good, keep it up.",
  "Ты был рядом только в # из # драк.": "You were only there for # of # fights.",
  "Часть драк, где ты выжил (#), команда тоже проиграла, так что дело не только в тебе.": "In some fights you survived (#) the team still lost — so it's not just you.",
  "Часть драк, где ты выжил (#, #), команда тоже проиграла, так что дело не только в тебе.": "In some fights you survived (#, #) the team still lost — so it's not just you.",
  "у * (#/#/#)": "by * (#/#/#)",
  "у * (#/#/#) и * (#/#/#)": "by * (#/#/#) and * (#/#/#)",
  "победа во многом на них.": "the win is largely theirs.",
  "победа во многом на этом игроке.": "the win is largely this player's.",
  "А на # ты сделал ровно то, что нужно": "And at # you did exactly the right thing",
  "у тебя оставалось #% здоровья, рядом # врага, в том числе *": "you had #% health left, # enemies nearby, including *",
  "у тебя оставалось #% здоровья, рядом # врагов, в том числе *": "you had #% health left, # enemies nearby, including *",
  "у тебя оставалось #% здоровья, рядом *": "you had #% health left, * nearby",
  "и ты ушёл живым.": "and you got out alive.",
  "Увидел угрозу — вышел.": "Saw the threat — stepped out.",
  "Это сохрани.": "Keep this.",
  # лежал мёртвым
  "с # по # ты пролежал мёртвым": "from # to # you lay dead",
  "#% этого отрезка": "#% of that stretch",
  "# смерть подряд": "# death in a row",
  "# смерти подряд": "# deaths in a row",
  "# смертей подряд": "# deaths in a row",
  # задание
  "Задание на следующие # игры": "Task for the next # games",
  "игра #": "game #",
  "Задание взято ✓": "Task taken ✓",
  "Беру это задание": "Take this task",
  "Другие варианты": "Other options",
  "Почему это задание": "Why this task",
  "Что делать": "What to do",
  "Твоё задание": "Your task",
  "# из # смертей — без своих рядом.": "# of # deaths — with nobody around.",
  "# из # смертей — от одного героя.": "# of # deaths — from one single hero.",
  "# из # смертей начались с половиной здоровья.": "# of # deaths started at half health.",
  "# из # раз тебя убили быстрее # секунд.": "# of # times they killed you in under # seconds.",
  "Против *, который бил тебя больше всех": "Against *, who hit you the hardest",
  # предметы против топов
  "Сравниваю твои предметы с топами на *…": "Comparing your items with top players on *…",
  "Вторая вещь — предметы.": "The second thing — items.",
  "у топов на * в среднем выходит на": "top players on * get it at",
  ", у тебя — на": ", yours — at",
  "# против #.": "# vs #.",
  "# против #": "# vs #",
  "Смерти на # случились ещё без *.": "Deaths at # happened before you had *.",
  "Смерти на # и # случились ещё без *.": "Deaths at # and # happened before you had *.",
  "Смерти на #, # и # случились ещё без *.": "Deaths at #, # and # happened before you had *.",
  "Зато * ты взял раньше топов (#).": "But you picked * earlier than top players (#).",
  "Сравнение — с игроками высокого ранга за последние # дней.": "Compared with high-rank players over the last # days.",
  "* бери раньше": "* — get it earlier",
  "у топов на этом герое он выходит к #.": "top players get it by #.",
  "По предметам ты не опаздываешь против топов на *, а * взял даже раньше (# против #).": "On items you're not behind the top players on *, and you even got * earlier (# vs #).",
  "По предметам ты идёшь в темпе топов на * — тут проблем нет.": "On items you're keeping pace with the top players on * — no problem here.",
  # прочее с матча
  "# убийств без смерти": "# kills without dying",
}

fix = {"#-й": "#"}  # было "#th" — давало «1th/2th/3th»
new = 0
for k, v in ADD.items():
    if k in D and k not in fix:
        continue
    if k in fix:
        D[k] = v; continue
    D[k] = v; new += 1

json.dump(D, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'было {before}, добавлено {new}, стало {len(D)}')
