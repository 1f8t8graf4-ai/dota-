#!/usr/bin/env python3
# Анализ kw в data/dd-ult.json: найти мусор (служебные слова, имена, междометия, A1)
# и строки, где kw не совпадает с en (форма из реплики).
import json, re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(HERE, "..", "data", "dd-ult.json")))

# служебные/A1/местоимения/предлоги — учить это бессмысленно
SERVICE = {
    "i", "i'm", "im", "i've", "i'll", "i'd", "me", "my", "mine", "myself", "we", "us", "our", "ours",
    "you", "your", "yours", "you're", "youre", "you'll", "you've", "u", "he", "him", "his", "she", "her", "hers",
    "it", "its", "it's", "they", "them", "their", "theirs", "this", "that", "these", "those",
    "here", "there", "now", "then", "soon", "today", "tonight", "tomorrow", "yesterday",
    "what", "who", "whom", "whose", "where", "when", "why", "how", "which",
    "is", "are", "was", "were", "be", "been", "being", "am", "do", "does", "did", "done", "doing",
    "have", "has", "had", "having", "will", "would", "shall", "should", "can", "could", "may", "might", "must",
    "get", "gets", "got", "gotta", "go", "goes", "going", "gone", "went", "come", "comes", "coming", "came",
    "take", "takes", "took", "taken", "make", "makes", "made", "see", "sees", "seen", "saw",
    "know", "knows", "knew", "known", "think", "thinks", "thought", "want", "wants", "wanted",
    "need", "needs", "needed", "like", "likes", "just", "very", "really", "so", "too", "more", "most",
    "some", "something", "somebody", "someone", "any", "anything", "anyone", "no", "nothing", "nobody", "none",
    "all", "everything", "everyone", "each", "every", "one", "two", "three", "first", "last", "next",
    "a", "an", "the", "and", "or", "but", "if", "because", "as", "of", "at", "by", "for", "with", "about",
    "into", "to", "from", "in", "on", "out", "up", "down", "off", "over", "under", "again", "back",
    "yes", "yeah", "yep", "nah", "nope", "ok", "okay", "hello", "hi", "hey", "bye",
    "oh", "ooh", "woo", "wooo", "wooooo", "woah", "whoa", "wow", "huh", "ah", "ahh", "ahhh", "hmm", "hm",
    "haha", "ha", "heh", "alas", "uh", "um", "er", "eh", "tsk", "shh", "shhh", "psst", "meh", "ugh",
    "time", "times", "way", "ways", "thing", "things", "man", "men", "woman", "women", "guy", "guys",
    "day", "days", "night", "nights", "world", "new", "york", "city", "home", "house", "god", "gods",
    "good", "great", "bad", "big", "small", "little", "old", "young", "long", "short", "right", "wrong",
    "dead", "die", "dies", "died", "dying", "death", "kill", "kills", "killed", "killing", "live", "lives",
    "name", "names", "enough", "never", "ever", "always", "still", "even", "only", "own", "well",
    "what's", "whats", "where's", "wheres", "who's", "whos", "there's", "theres", "let's", "lets",
}
# имена героев и локаций — не словарь
NAMES = {
    "abrams", "apollo", "bebop", "billy", "calico", "celeste", "danny", "doorman", "dormen",
    "grey", "talon", "haze", "infernus", "ivory", "ivy", "kelvin", "lady", "geist", "lash",
    "mcginnis", "mirage", "mo", "krill", "paradox", "paige", "pocket", "seven", "shiv", "silver",
    "sinclair", "victor", "vindicta", "viscous", "vyper", "warden", "wraith", "yamato", "rat", "king",
    "venator", "rem", "astro", "holliday", "artist", "violet", "baba", "solomon", "nurse", "harrow",
    "amazon", "tengu", "magician", "slork", "trapper", "archer", "/frame", "zealot",
    "manhattan", "amber", "sapphire", "emerald", "ruby", "amethyst", "patron", "madison", "staten",
    "new", "york", "marble", "central", "park", "brooklyn", "queens", "harlem", "coney",
}

def norm(s):
    return re.sub(r"[^a-z' ]", "", s.lower().replace("’", "'").replace("‘", "'").strip())

bad, form_miss, empty_ok = [], [], 0
total_kw = 0
for hero, lines in d.items():
    for i, l in enumerate(lines):
        kws = l.get("kw") or []
        total_kw += len(kws)
        if not kws:
            empty_ok += 1
            continue
        en_low = l["en"].lower()
        for pair in kws:
            w = pair[0]
            nw = norm(w)
            if not nw:
                bad.append((hero, i, w, "пустое/нечитаемое"))
                continue
            if nw in SERVICE:
                bad.append((hero, i, w, "служебное/A1"))
                continue
            if nw in NAMES or (len(nw.split()) >= 1 and all(p in NAMES for p in nw.split())):
                bad.append((hero, i, w, "имя/локация"))
                continue
            # форма должна быть в en (дословно, без пунктуации)
            if norm(w) not in en_low.replace("’", "'"):
                form_miss.append((hero, i, w, l["en"][:60]))

print(f"Всего реплик: {sum(len(v) for v in d.values())}, всего kw: {total_kw}, реплик без kw: {empty_ok}")
print(f"Мусорных kw: {len(bad)}; форма не из en: {len(form_miss)}")
print("\n=== МУСОР (первые 80) ===")
for hero, i, w, why in bad[:80]:
    print(f"{hero}[{i}] {w!r} — {why}")
print("\n=== ФОРМА НЕ ИЗ EN (первые 30) ===")
for hero, i, w, en in form_miss[:30]:
    print(f"{hero}[{i}] {w!r} | {en}")
