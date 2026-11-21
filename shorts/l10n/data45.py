"""22.11 — тексты голоса глав 4–5 и финала на английском и немецком (на проверку перед записью голоса; ролики пока только RU).

Ключ — сцена в таймлайне русского голоса: tl/v210s-ru.json (глава 4), tl/v220y-ru.json и tl/v220s-ru.json (глава 5 и финал).
Правила как в data.py: DE — на «ihr», кавычки „…“, тире –. Глава 4 DE: «нагреватель» — Heizelement / Tabakerhitzer (не Heizer),
«без вреда?» — «also harmlos?» (не «kein Schaden?») — по проверке 22.11.
Строка s3 главы 5 («У нас такие пакетики все зовут снюсом…») адаптирована: «у нас» = в России, для EN/DE — «многие».
"""

# новый вопрос в конце шортса главы 3 (записан в voice/v220 как q3): вместо строк 13–14 и «Без огня — значит, без вреда?»
CH3_Q = ('А знаете, что производитель «Мальборо» однажды пообещал?', (
    'And do you know what the maker of Marlboro once promised?',
    'Und wisst ihr, was der Marlboro-Hersteller einmal versprochen hat?'))

CH4 = {   # глава 4 «2014 · Нагреватели»: фильм — s1–s15 (+ доска), шортс — s1–s15 и вопрос q
    's1': ('The maker of Marlboro once promised to quit cigarettes.',
           'Der Marlboro-Hersteller hat einmal versprochen, Zigaretten aufzugeben.'),
    's2': ('They bought full pages in British newspapers: “Our New Year’s resolution — we’re trying to give up cigarettes.”',
           'Er kaufte ganze Seiten in britischen Zeitungen: „Unser Neujahrsvorsatz: Wir versuchen, Zigaretten aufzugeben.“'),
    's3': ('To put it mildly, they didn’t keep their word.',
           'Sein Wort hat er, gelinde gesagt, nicht gehalten.'),
    's4': ('They started “quitting” early: in 2014, Nagoya, Japan, and Milan, Italy, got a cigarette you can’t light.',
           'Mit dem Aufhören fing er schon früher an: 2014 tauchte im japanischen Nagoya und im italienischen Mailand eine Zigarette auf, die man nicht anzünden kann.'),
    's5': ('The tobacco is warmed by a heater, at half the temperature of a flame: your jacket doesn’t smell, there’s no ash, and you can take a puff right in the car.',
           'Den Tabak darin erhitzt ein Heizelement – nur halb so heiß wie eine Flamme: Die Jacke riecht nicht, es gibt keine Asche, und ziehen kann man sogar im Auto.'),
    's6': ('This is IQOS, and when comedians raved about it on a popular Japanese TV show in 2016, IQOS sold out everywhere.',
           'Das ist IQOS – und als 2016 Comedians in einer beliebten japanischen Show davon schwärmten, war IQOS überall ausverkauft.'),
    's7': ('No fire — so, no harm?',
           'Kein Feuer – also harmlos?'),
    's8': ('A year later, Swiss scientists captured this “vapor” and found the same toxins as in smoke. Lower levels of most, even higher of one — and eighty-four percent of a cigarette’s nicotine.',
           'Ein Jahr später fingen Schweizer Forscher diesen „Dampf“ ein und fanden dieselben Giftstoffe wie im Rauch. Von vielen weniger, von einem sogar mehr – und beim Nikotin vierundachtzig Prozent einer Zigarette.'),
    's9': ('They even titled their paper “Smoke by Any Other Name.”',
           'Ihre Studie nannten sie schlicht: „Rauch unter anderem Namen“.'),
    's10': ('In 2020, the US regulator allowed IQOS to say it contains fewer harmful chemicals — but it still won’t let them say “less harm.”',
            '2020 erlaubte die US-Behörde den Hinweis, dass IQOS weniger Schadstoffe enthält – aber „weniger schädlich“ dürfen sie bis heute nicht sagen.'),
    's11': ('Remember R.J. Reynolds — the ones who, in 1973, were looking for ways to hook teenagers?',
            'Erinnert ihr euch an R.J. Reynolds – die 1973 nach Wegen suchten, Jugendliche süchtig zu machen?'),
    's12': ('Their own fire-free cigarettes never caught on: one, with a carbon tip, burned through more than three hundred million dollars.',
            'Ihre eigenen Zigaretten ohne Feuer setzten sich nicht durch: Eine mit glühender Kohlespitze verschlang über dreihundert Millionen Dollar.'),
    's13': ('But their old patents survived: in 2021, the US International Trade Commission ruled that IQOS infringed them — and kicked it out of America.',
            'Dafür überlebten ihre alten Patente: 2021 entschied die US-Handelskommission, dass IQOS sie verletzt – und warf es aus Amerika raus.'),
    's14': ('And the promise to quit? In 2024, IQOS had thirty-two million users — and the company sold six hundred seventeen billion cigarettes, more than the year before.',
            'Und das Versprechen, aufzuhören? 2024 hatte IQOS zweiunddreißig Millionen Nutzer – und der Konzern verkaufte sechshundertsiebzehn Milliarden Zigaretten, mehr als im Jahr davor.'),
    's15': ('They quit exactly the way you do.',
            'Sie hören genauso auf wie ihr.'),
    'q': ('Can you guess what they came back to America with?',
          'Ratet mal, womit sie doch noch nach Amerika zurückkamen?'),
}

CH5 = {   # глава 5 «2022 · Снюс»: фильм — b1–b2, s1–s12 (+ финал), шортс — b1–b2, s1–s11 и вопрос q
    'b1': ('But Philip Morris did make it back to America — a year after the ban, with a small white can — a sixteen-billion-dollar deal.',
           'Doch Philip Morris kam nach Amerika zurück – ein Jahr nach dem Verbot, mit einer kleinen weißen Dose für sechzehn Milliarden.'),
    'b2': ('There isn’t even any… tobacco in it.',
           'Darin ist nicht mal… Tabak.'),
    's1': ('You can’t see it, hear it, or smell it: a small white pouch goes under the upper lip — and that’s it.',
           'Man sieht sie nicht, man hört sie nicht, und sie riechen nach nichts: Ein kleiner weißer Beutel kommt unter die Oberlippe – fertig.'),
    's2': ('First it stings your gums, the nicotine goes straight into your bloodstream, and no one around can tell: no smoke, no vapor — in a meeting or on a plane.',
           'Erst brennt es am Zahnfleisch, das Nikotin geht direkt darüber ins Blut, und von außen merkt man nichts: kein Rauch, kein Dampf – ob im Meeting oder im Flugzeug.'),
    's3': ('Lots of people call these pouches snus, but real Swedish snus is tobacco.',
           'Viele nennen solche Beutel Snus – dabei ist echter schwedischer Snus Tabak.'),
    's4': ('These contain no tobacco — but they do contain nicotine, and it’s extracted… from tobacco.',
           'Hier ist kein Tabak drin – dafür Nikotin, und das wird gewonnen… aus Tabak.'),
    's5': ('The Swedes invented them — and the maker of Marlboro bought the whole Swedish company, along with its American factory in Kentucky.',
           'Erfunden haben sie die Schweden – und der Marlboro-Hersteller kaufte die schwedische Firma komplett, samt amerikanischem Werk in Kentucky.'),
    's6': ('Two years later, pouches were flying off shelves all over America, just like IQOS once did in Japan: in 2024 alone, nearly six hundred million cans were sold there.',
           'Zwei Jahre später waren die Beutel in ganz Amerika ausverkauft – wie einst IQOS in Japan: Allein 2024 wurden dort fast sechshundert Millionen Dosen verkauft.'),
    's7': ('In 2025, the US regulator approved them — the first nicotine pouches ever authorized, and with flavors right away: mint, citrus, coffee, cinnamon.',
           '2025 ließ die US-Behörde sie zu – als allererste Nikotinbeutel, und gleich mit Geschmack: Minze, Zitrus, Kaffee, Zimt.'),
    's8': ('Five years earlier, JUUL had been banned from selling flavors like these.',
           'Fünf Jahre zuvor wurden JUUL genau solche Geschmacksrichtungen verboten.'),
    's9': ('And in 2026, ZYN got permission for what IQOS still doesn’t have — to talk about risk: “ZYN instead of cigarettes — lower risk of mouth and lung cancer, heart disease, and stroke.”',
           'Und 2026 durfte ZYN etwas, das IQOS bis heute verwehrt bleibt – über das Risiko sprechen: „ZYN statt Zigaretten – geringeres Risiko für Mund- und Lungenkrebs, Herzkrankheiten und Schlaganfall.“'),
    's10': ('The catch: American teens barely smoke cigarettes anymore — and among them, pouches have already overtaken cigarettes.',
            'Nur: Amerikanische Schüler rauchen kaum noch Zigaretten – und bei ihnen haben die Beutel die Zigaretten schon überholt.'),
    's11': ('And less than two months later, stronger pouches were approved: nine and eleven milligrams instead of three and six.',
            'Und keine zwei Monate später wurden stärkere Beutel zugelassen: neun und elf Milligramm statt drei und sechs.'),
    's12': ('Every card on this board is a new way to quit. All that’s left is to flip the board itself.',
            'Jede Karte an dieser Pinnwand ist ein neuer Weg, aufzuhören. Jetzt bleibt nur noch, die Pinnwand selbst umzudrehen.'),
    'q': ('Can you guess what’s on the back of this board?',
          'Ratet mal, was auf der Rückseite dieser Pinnwand ist?'),
}

FIN = {   # финал фильма (после главы 5)
    'f1': ('So, what do you know about nicotine?',
           'Also – was wisst ihr über Nikotin?'),
    'f2': ('That it’s smoked, heated, vaped, and tucked under the lip — and every time, it’s sold as a way to quit.',
           'Dass man es raucht, erhitzt, dampft und unter die Lippe legt – und es jedes Mal als Weg zum Aufhören verkauft wird.'),
    'f3': ('Flip the board: all five threads lead to the tobacco giants.',
           'Dreht die Pinnwand um: Alle fünf Fäden führen zu den Tabakriesen.'),
    'f4': ('The snake bites its own tail: you quit one thing — they sell you the next.',
           'Die Schlange beißt sich in den Schwanz: Ihr hört mit einem auf – und sie verkaufen euch das nächste.'),
}
