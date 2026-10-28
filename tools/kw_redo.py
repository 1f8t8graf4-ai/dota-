#!/usr/bin/env python3
# Переделка kw в data/dd-ult.json по ревью-ZAI-v12 (пункт 6 ТЗ v19).
# Правило: 1-2 выражения на реплику, значение — в этой реплике, форма — как в en,
# без имён, междометий и служебных слов; нечего учить — пустой список.
# Авто-проверка: форма каждого kw обязана быть в en реплики (как в ревью: kw — ровно как в en).
import json, re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, "..", "data", "dd-ult.json")

# (hero, idx) -> новый kw. Отсутствие в словаре = не трогать.
REDO = {
    ("abrams", 2): [["Here I come", "я уже иду (возглас при появлении)"]],
    ("abrams", 4): [],
    ("abrams", 5): [],
    ("abrams", 6): [["gonna", "собираюсь (разг. gonna = going to)"]],
    ("abrams", 7): [["Please work", "ну пожалуйста, сработай (просьба к предмету)"]],
    ("abrams", 8): [["one chance", "один-единственный шанс"]],
    ("abrams", 9): [["on the case", "взял дело в работу, слежу за ним"]],
    ("abrams", 10): [["We got this", "мы справимся (разг.)"]],
    ("apollo", 0): [["birthright", "право по рождению"]],
    ("apollo", 1): [["unmatched", "непревзойдённый"]],
    ("apollo", 2): [],
    ("apollo", 3): [],
    ("apollo", 4): [],
    ("apollo", 5): [["No more games", "хватит игр"]],
    ("apollo", 6): [],
    ("apollo", 7): [["make this count", "сделать не зря, с толком"]],
    ("apollo", 8): [["ending this", "ставлю в этом точку"]],
    ("apollo", 9): [["bear witness", "узреть, стать свидетелем"]],
    ("apollo", 10): [["proud son of", "гордый сын/уроженец"]],
    ("bebop", 1): [],
    ("bebop", 4): [["running hot", "перегревается, работает на пределе"]],
    ("bebop", 5): [["cut through", "пройти сквозь, разрезать путь"]],
    ("bebop", 6): [],
    ("billy", 1): [["Let's dance", "потанцуем! (про начало драки)"]],
    ("billy", 2): [["The party's here", "вечеринка началась — я здесь"]],
    ("billy", 6): [["You wanna go?", "ты хочешь подраться? (wanna = want to)"]],
    ("billy", 7): [["Where you think you're goin'?", "куда это ты собрался? (разг.)"]],
    ("calico", 0): [["Adieu", "адьё (фр. «до свидания», манерно)"]],
    ("calico", 2): [["where I wish", "куда пожелаю"]],
    ("calico", 4): [],
    ("calico", 5): [],
    ("calico", 10): [["a lion amongst the lambs", "лев среди овец (один против всех)"]],
    ("celeste", 0): [["Keep your eye on the ball", "не спускай глаз с главного (идиома)"]],
    ("celeste", 1): [],
    ("celeste", 2): [["This should be good", "должно быть интересно (ирония)"]],
    ("celeste", 6): [],
    ("celeste", 10): [],
    ("doorman", 0): [["Checking in", "заселяюсь (в отеле)"]],
    ("dynamo", 0): [],
    ("dynamo", 2): [["use some help", "не помешала бы помощь"]],
    ("dynamo", 4): [],
    ("dynamo", 5): [],
    ("dynamo", 6): [["Now's the time", "время пришло"]],
    ("graves", 9): [["shouldn't be too hard", "не должно быть слишком сложно"]],
    ("graves", 10): [["On the plus side", "с другой стороны (плюс)"]],
    ("grey-talon", 0): [["while you still can", "пока ещё можешь"]],
    ("grey-talon", 2): [["no hiding", "не спрятаться"]],
    ("grey-talon", 3): [["I'll find them", "я их найду"]],
    ("grey-talon", 6): [],
    ("grey-talon", 7): [["I'll find them", "я их найду"]],
    ("grey-talon", 8): [["No time to rest", "некогда отдыхать"]],
    ("grey-talon", 10): [["what needs to be done", "что должно быть сделано"]],
    ("haze", 2): [],
    ("haze", 3): [["It's my time", "мой час настал"]],
    ("haze", 4): [["This is the end", "это конец"]],
    ("haze", 5): [["No survivors", "никого в живых"]],
    ("haze", 7): [["You'll all pay", "вы все заплатите"]],
    ("haze", 8): [["This is where", "вот именно здесь (усиление)"]],
    ("haze", 9): [],
    ("holliday", 1): [["shoot 'em already", "пристрелите их уже (разг.)"]],
    ("holliday", 2): [["Wrangling", "упаковываю, усмиряю (как скот)"]],
    ("holliday", 8): [["Gimme a hand", "помогите (разг., gimme = give me)"]],
    ("holliday", 9): [],
    ("infernus", 1): [],
    ("infernus", 6): [["This better work", "только бы сработало"]],
    ("infernus", 8): [["gonna", "собираюсь (разг. gonna = going to)"]],
    ("ivy", 2): [],
    ("ivy", 3): [],
    ("ivy", 6): [],
    ("ivy", 9): [["how are we feeling", "как ощущения, как настроены"]],
    ("kelvin", 1): [["Face me", "сразись со мной (лицом к лицу)"]],
    ("kelvin", 4): [["fare", "справляться (как тебе придётся)"]],
    ("kelvin", 8): [],
    ("lady-geist", 1): [["think you're winning", "думаешь, побеждаешь (наивно)"]],
    ("lady-geist", 2): [["Right where I want you", "именно там, куда мне надо (ты в моих руках)"]],
    ("lady-geist", 3): [["What's yours is mine", "что твоё — то моё"]],
    ("lash", 0): [],
    ("mcginnis", 0): [],
    ("mcginnis", 2): [],
    ("mcginnis", 4): [["give 'em hell", "дать им прикурить (досл. устроить им ад)"]],
    ("mcginnis", 5): [["Going hot", "вхожу в боевую готовность"]],
    ("mcginnis", 7): [],
    ("mcginnis", 10): [],
    ("mina", 3): [],
    ("mina", 4): [],
    ("mina", 5): [["hunting", "охота"]],
    ("mina", 6): [["missed your chance", "упустил свой шанс"]],
    ("mina", 7): [],
    ("mina", 8): [],
    ("mina", 9): [["desperately need", "крайне нуждаться (desperately = отчаянно)"]],
    ("mina", 10): [["Greatness awaits", "величие ждёт"]],
    ("mirage", 0): [],
    ("mirage", 1): [],
    ("mirage", 2): [["where I'm needed", "там, где я нужен"]],
    ("mirage", 3): [["need me to", "нужен, чтобы я (сделал)"]],
    ("mirage", 4): [["whims", "прихоть"]],
    ("mirage", 5): [["where I'm needed", "там, где я нужен"]],
    ("mirage", 6): [["get out of here", "свалить отсюда"]],
    ("mirage", 7): [["safe", "безопасно"]],
    ("mirage", 9): [],
    ("mo-krill", 1): [],
    ("mo-krill", 4): [["Take care of them", "разберусь с ними (take care of)"]],
    ("mo-krill", 5): [],
    ("mo-krill", 6): [],
    ("mo-krill", 9): [["let's have some fun", "давай поразвлечёмся"]],
    ("mo-krill", 10): [["familiar with", "знакомый с"]],
    ("nurse-harrow", 0): [],
    ("nurse-harrow", 3): [["something to show", "кое-что показать"]],
    ("nurse-harrow", 4): [["Gaze upon", "взгляни на (пристально)"]],
    ("nurse-harrow", 7): [],
    ("nurse-harrow", 8): [],
    ("nurse-harrow", 9): [["under my care", "под моей опекой"]],
    ("paige", 0): [],
    ("paige", 1): [],
    ("paige", 2): [],
    ("paige", 6): [],
    ("paige", 7): [],
    ("paige", 8): [],
    ("paige", 9): [],
    ("paradox", 1): [],
    ("paradox", 3): [["Leave this to me", "оставь это мне (я разберусь)"]],
    ("paradox", 4): [],
    ("paradox", 5): [],
    ("paradox", 7): [["You thought you had me", "думал, ты меня поймал? (не тут-то было)"]],
    ("paradox", 8): [],
    ("pocket", 8): [],
    ("rat-king", 2): [["It's our time now", "сейчас наше время"]],
    ("rem", 2): [["Naps", "дневной сон (nap)"]],
    ("rem", 5): [],
    ("rem", 7): [["you guys", "вы, ребята"]],
    ("seven", 0): [["while you can", "пока ещё можешь"]],
    ("seven", 2): [["No escape", "спасения нет"]],
    ("shiv", 0): [["asked for this", "сам напросился"]],
    ("shiv", 2): [],
    ("shiv", 6): [["asked for this", "сам напросился"]],
    ("silver", 6): [["made me mad", "разозлил меня"]],
    ("silver", 7): [["not givin' me any choice", "не оставляешь мне выбора"]],
    ("silver", 10): [],
    ("solomon", 0): [["Here comes", "вот идёт / появляется"]],
    ("solomon", 1): [["Long may she reign", "да здравствует (досл. долго пусть правит)"]],
    ("solomon", 2): [["has arrived", "прибыла (торжественно)"]],
    ("solomon", 5): [["might", "могущество, мощь"]],
    ("solomon", 6): [["do not concede", "не сдаюсь"]],
    ("venator", 1): [],
    ("venator", 4): [],
    ("venator", 5): [["delay", "отсрочить"]],
    ("venator", 7): [],
    ("venator", 8): [["as many as I can", "сколько смогу (как можно больше)"]],
    ("venator", 9): [],
    ("victor", 2): [["I'm back", "я вернулся"]],
    ("victor", 3): [["It takes more than that", "этого мало (нужно больше)"]],
    ("victor", 5): [["think you're winning", "думаешь, побеждаешь (наивно)"]],
    ("victor", 6): [["find some answers", "найти ответы"]],
    ("vindicta", 0): [],
    ("vindicta", 5): [],
    ("viscous", 0): [],
    ("viscous", 1): [],
    ("viscous", 2): [],
    ("viscous", 3): [],
    ("viscous", 4): [["goo", "слизь, желе (разг.)"]],
    ("viscous", 5): [],
    ("viscous", 6): [],
    ("viscous", 7): [],
    ("viscous", 8): [],
    ("viscous", 9): [],
    ("viscous", 10): [],
    ("vyper", 2): [],
    ("vyper", 3): [["screw this up", "запороть это дело"]],
    ("vyper", 6): [],
    ("vyper", 9): [["know how to", "уметь, знать, как (сделать)"]],
    ("warden", 8): [],
    ("wraith", 1): [],
    ("wraith", 2): [],
    ("wraith", 5): [["Stay where you are", "оставайся на месте"]],
    ("wraith", 10): [["summoning", "призывая (summon)"]],
}

def norm(s):
    return re.sub(r"[^a-z' ]", "", s.lower().replace("’", "'").replace("‘", "'").strip())

def main():
    d = json.load(open(PATH))
    changed, emptied, errors = 0, 0, []
    for (hero, i), new_kw in REDO.items():
        if hero not in d or i >= len(d[hero]):
            errors.append(f"{hero}[{i}]: нет такой реплики"); continue
        l = d[hero][i]
        en_low = l["en"].lower().replace("’", "'").replace("‘", "'")
        for pair in new_kw:
            if norm(pair[0]) not in norm(en_low) and norm(pair[0]) not in en_low:
                # допускаем падежные формы: проверяем по словам, если фраза целиком не нашлась
                words = [norm(w) for w in pair[0].split() if norm(w)]
                if not all(w in en_low for w in words):
                    errors.append(f"{hero}[{i}]: форма {pair[0]!r} не в en: {l['en']!r}")
        if not new_kw and l.get("kw"):
            emptied += 1
        if new_kw != l.get("kw"):
            changed += 1
        l["kw"] = new_kw
    if errors:
        print("ОШИБКИ:"); [print(" -", e) for e in errors]; sys.exit(1)
    json.dump(d, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    total_kw = sum(len(l.get("kw") or []) for v in d.values() for l in v)
    total_empty = sum(1 for v in d.values() for l in v if not (l.get("kw") or []))
    print(f"ОК: правок {changed}, из них пустых списков {emptied}; всего kw теперь {total_kw}; реплик без kw {total_empty} (это норма по правилу)")

if __name__ == "__main__":
    main()
