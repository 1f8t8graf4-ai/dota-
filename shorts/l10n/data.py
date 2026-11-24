"""21.11 — локализация глав 1–3 на английский и немецкий без новой записи голоса.

SENT — реплики голоса: русский текст (как в tl/<ролик>.json → sent[].text) → (EN, DE).
  «|» в переводе — место паузы в русском голосе (если пауз столько же, субтитры перевода идут по ним).
  Тексты годятся и для будущей озвучки (EN/DE), факты — те же, что в русском.
STR — надписи в кадре: русская строка, как её рисует глава (fillText), → (EN, DE). Заполнено по прогону
  `node capture.mjs <ролик> texts` (все строки, которые ролик рисует), сборка — `python3 l10n/build.py`.
RULES — числа с единицами и прочее по шаблону (регулярные выражения JS).
DE — на «ihr» (как принято в немецких роликах), кавычки „…“, тире –.
"""

SENT = {
    # ===================== Глава 1 «Боб» (1979 · Соль) =====================
    'Что вы знаете об одноразках? Что это модная замена сигаретам с безобидным паром со вкусом манго и мяты?': (
        'What do you know about disposable vapes? That they’re | a trendy replacement for cigarettes, with harmless mango and mint vapor?',
        'Was wisst ihr über Einweg-Vapes? Dass sie | ein angesagter Zigarettenersatz sind – mit harmlosem Dampf nach Mango und Minze?'),
    'А знаете ли вы, что жидкость внутри них изобрели табачные гиганты ещё пятьдесят лет назад?': (
        'But did you know the liquid inside them was invented by tobacco giants fifty years ago?',
        'Aber wusstet ihr, dass die Flüssigkeit darin schon vor fünfzig Jahren von Tabakriesen erfunden wurde?'),
    'Вернёмся в 1973 год. Табачная империя «Рейнольдс», создатель сигарет Camel и Winston, готовит секретный отчёт.': (
        'Let’s go back to 1973. The tobacco empire R.J. Reynolds, maker of Camel and Winston, is preparing a secret report.',
        'Zurück ins Jahr 1973. Das Tabakimperium R.J. Reynolds, Hersteller von Camel und Winston, bereitet einen geheimen Bericht vor.'),
    'Главная цель документа звучала прямо:': (
        'The document’s main goal was stated bluntly:',
        'Das Hauptziel des Dokuments stand ganz offen drin:'),
    '«Мы должны получить свою долю молодёжного рынка».': (
        '“We must get our share of the youth market.”',
        '„Wir müssen uns unseren Anteil am Jugendmarkt sichern.“'),
    'Но вот проблема: обычный табачный дым слишком едкий и сильно дерёт горло подросткам.': (
        'But here’s the problem: regular tobacco smoke is too harsh and burns teenagers’ throats.',
        'Doch es gab ein Problem: Normaler Tabakrauch ist zu scharf und kratzt Jugendlichen heftig im Hals.'),
    'Тогда химики смешали никотин с особой кислотой и получили никотиновую соль, которая заходит мягко даже в убойной дозе.': (
        'So chemists mixed nicotine with a special acid and got nicotine salt — | smooth to inhale even at a knockout dose.',
        'Also mischten Chemiker Nikotin mit einer speziellen Säure und erhielten Nikotinsalz – | das sich selbst in brutaler Dosis sanft inhalieren lässt.'),
    'Но электронных сигарет тогда ещё не продавали заливать эту жидкость было не во что. И секретную формулу спрятали в архив.': (
        'But nobody sold e-cigarettes back then — there was nothing to put this liquid in. So the secret formula went into the archive.',
        'Aber E-Zigaretten gab es damals noch nicht – man hatte nichts, wo man die Flüssigkeit einfüllen konnte. Also landete die geheime Formel im Archiv.'),
    'В 1998 году суд заставил табачников раскрыть свои тайны, и четырнадцать миллионов секретных документов опубликовали в Калифорнии.': (
        'In 1998, a court forced the tobacco companies to reveal their secrets, and fourteen million secret documents were published in California.',
        '1998 zwang ein Gericht die Tabakkonzerne, ihre Geheimnisse offenzulegen – und vierzehn Millionen geheime Dokumente wurden in Kalifornien veröffentlicht.'),
    'По странному стечению обстоятельств прямо по соседству со Стэнфордским университетом, где эти бумаги вскоре находят два студента.': (
        'By a strange coincidence, right next door to Stanford University, where these papers are soon found by two students.',
        'Wie der Zufall es wollte, gleich neben der Stanford University – wo zwei Studenten diese Papiere bald entdecken.'),
    'Позже они создают электронную сигарету, похожую на флешку, внутри которой оживает та самая соль.': (
        'Later they create an e-cigarette that looks like a USB stick — and inside it, that very salt comes back to life.',
        'Später bauen sie eine E-Zigarette, die wie ein USB-Stick aussieht – und in ihr erwacht genau dieses Salz zum Leben.'),
    'Один картридж заменял целую пачку сигарет, а раз мягкий пар больше не обжигал горло, школьники тянули его без остановки и подсаживались в разы быстрее.': (
        'One pod replaced a whole pack of cigarettes, and since the smooth vapor no longer burned the throat, teens puffed nonstop and got hooked way faster.',
        'Ein Pod ersetzte eine ganze Schachtel Zigaretten, und weil der sanfte Dampf nicht mehr im Hals brannte, zogen Schüler ohne Pause und wurden um ein Vielfaches schneller süchtig.'),
    'Уже через четыре года в США парил каждый четвёртый старшеклассник, а треть новой компании за тринадцать миллиардов долларов выкупил производитель «Мальборо».': (
        'Within four years, one in four US high school students was vaping — and a third of the new company, for thirteen billion dollars, was bought by the maker of Marlboro.',
        'Schon vier Jahre später dampfte in den USA jeder vierte Highschool-Schüler – und der Hersteller von Marlboro kaufte ein Drittel der neuen Firma für dreizehn Milliarden Dollar.'),
    'Старый план сработал идеально.': (
        'The old plan worked perfectly.',
        'Der alte Plan ging perfekt auf.'),
    'Бумажная сигарета ушла в прошлое, а табачная империя сорвала самый большой куш в своей истории.': (
        'The paper cigarette became a thing of the past, and the tobacco empire hit the biggest jackpot in its history.',
        'Die Papierzigarette wurde Geschichte, und das Tabakimperium räumte den größten Jackpot seiner Geschichte ab.'),
    'Признайтесь... вам ведь и сейчас захотелось... затянуться?': (
        'Admit it… right now, you want to… take a puff, don’t you?',
        'Gebt es zu… gerade jetzt hättet ihr Lust… auf einen Zug, oder?'),
    'Захотите бросить вам и это продадут. Причём одни и те же люди... А вот кто именно смотрите на YouTube.': (
        'Want to quit? They’ll sell you that too. And it’s the same people… As for who exactly — | watch on YouTube.',
        'Wollt ihr aufhören? Auch das verkauft man euch. Und zwar dieselben Leute… Wer genau – | seht ihr auf YouTube.'),
    'Так... о чём это я? А, точно!': (
        'So… where was I? Oh, right!',
        'Also… wo war ich? Ach ja!'),
    'Но «Джул» — только первая из пяти улик. Дальше история становится... холоднее.': (   # v22.5 (22.11): без «карточки» и «доски» (правило финального ТЗ)
        'But JUUL is only the first of five clues. From here, the story gets… colder.',
        'Aber JUUL ist nur das erste von fünf Indizien. Ab hier wird die Geschichte… kälter.'),

    # ===================== Глава 2 «Лёд» (2020 · Лазейка одноразок) =====================
    'Почему ваша одноразка такая ледяная? И почему её вообще продают, если вейпы со вкусами в Америке запретили ещё в две тысячи двадцатом году?': (
        'Why is your disposable vape so icy? And why is it even on sale, if flavored vapes were banned in America back in 2020?',
        'Warum ist eure Einweg-Vape so eisig? Und warum wird sie überhaupt verkauft, wenn Vapes mit Geschmack in Amerika schon 2020 verboten wurden?'),
    'Всё из-за одного слова, которое забыли вписать в закон.': (
        'It all comes down to one word they forgot to put in the law.',
        'Alles wegen eines einzigen Wortes, das man vergessen hat, ins Gesetz zu schreiben.'),
    'Январь две тысячи двадцатого года: после скандала с «Джулом» власти США рубят вейпы со вкусами — манго, фрукты, десерты, мята — под нож.': (
        'January 2020: after the JUUL scandal, US authorities put flavored vapes — mango, fruit, desserts, mint — on the chopping block.',
        'Januar 2020: Nach dem JUUL-Skandal kommen in den USA Vapes mit Geschmack – Mango, Frucht, Dessert, Minze – unters Fallbeil.'),
    'Но разверните сам документ: запрет прописали только для вейпов со сменными картриджами.': (
        'But unfold the document itself: the ban was written only for vapes with replaceable cartridges.',
        'Aber schaut ins Dokument selbst: Das Verbot galt nur für Vapes mit wechselbaren Pods.'),
    'А цельные одноразовые там... просто не упомянуты.': (
        'And all-in-one disposables… simply aren’t mentioned.',
        'Und Einweg-Geräte aus einem Stück… werden darin schlicht nicht erwähnt.'),
    'Пока «Джул» убирал вкусы с полок, в Шэньчжэне уже запускали конвейеры.': (
        'While JUUL was pulling its flavors off the shelves, in Shenzhen, assembly lines were already starting up.',
        'Während JUUL seine Geschmacksrichtungen aus den Regalen nahm, liefen in Shenzhen schon die Fließbänder an.'),
    'Пафф Бар, эйч-кью-ди, а потом Эльф Бар — одноразки накрыли Америку волной.': (
        'Puff Bar, HQD, and then Elf Bar — disposables swept over America like a wave.',
        'Puff Bar, HQD und dann Elf Bar – Einweg-Vapes überrollten Amerika wie eine Welle.'),
    'Всего за год их доля у парящих старшеклассников выросла в одиннадцать раз.': (
        'In just one year, their share among high schoolers who vape jumped eleven times.',
        'In nur einem Jahr stieg ihr Anteil bei dampfenden Highschool-Schülern um das Elffache.'),
    'И это были уже не просто вкусы.': (
        'And it was no longer just about flavor.',
        'Und es ging längst nicht mehr nur um Geschmack.'),
    'В жидкость добавили синтетический холодок вэ-эс двадцать три — он обманывает рецепторы: горло чувствует лёд, а не то, как дерёт никотин.': (
        'They added a synthetic coolant, WS-23, to the liquid — it fools your receptors: your throat feels ice, not the burn of nicotine.',
        'In die Flüssigkeit kam ein synthetischer Kühlstoff, WS-23 – er täuscht die Rezeptoren: Der Hals spürt nur Eis – statt des Nikotin-Kratzens.'),
    'Помните, один картридж заменял пачку?': (
        'Remember how one pod replaced a pack?',
        'Wisst ihr noch: Ein Pod ersetzte eine Schachtel?'),
    'А потом одноразки разрослись: тринадцать миллилитров, двойная сетка и тысячи затяжек.': (
        'Then disposables got bigger: thirteen milliliters, a dual mesh coil, and thousands of puffs.',
        'Dann wurden Einweg-Vapes immer größer: dreizehn Milliliter, Doppel-Mesh-Coil und Tausende Züge.'),
    'По никотину — как шестнадцать картриджей.': (
        'Nicotine-wise — like sixteen pods.',
        'Beim Nikotin – wie sechzehn Pods.'),
    'А чтобы обойти проверки, никотин начали варить прямо в пробирке — без единого листа табака.': (
        'And to get around the rules, they started brewing nicotine right in a test tube — without a single tobacco leaf.',
        'Und um die Regeln zu umgehen, brauten sie Nikotin direkt im Reagenzglas – ohne ein einziges Tabakblatt.'),
    'И когда одноразки стали приносить миллиарды долларов в год, на этот рынок зашли и сами старые табачные корпорации.': (
        'And once disposables were bringing in billions of dollars a year, the old tobacco corporations moved into the market themselves.',
        'Und als Einweg-Vapes Milliarden Dollar im Jahr einbrachten, stiegen auch die alten Tabakkonzerne selbst in den Markt ein.'),
    'Запретом хотели отнять у школьников вкус — а подарили ледяной пар, гигантские баки и никотин из пробирки.': (
        'The ban was meant to take flavor away from teens — instead it gave them icy vapor, giant tanks, and test-tube nicotine.',
        'Das Verbot sollte Schülern den Geschmack nehmen – stattdessen bekamen sie eisigen Dampf, riesige Tanks und Nikotin aus dem Reagenzglas.'),
    'Так лазейка две тысячи двадцатого года стала второй из пяти улик. А разбор остальных трёх уже ждёт вас на YouTube.': (   # v22.5 (22.11): без «карточки» и «доски»
        'So the 2020 loophole became the second of five clues. The breakdown of the other three is already waiting for you on YouTube.',
        'So wurde das Schlupfloch von 2020 zum zweiten von fünf Indizien. Die anderen drei warten schon auf YouTube auf euch.'),
    'Так что в следующий раз, делая затяжку, просто спросите себя...': (
        'So next time you take a puff, just ask yourself…',
        'Also, wenn ihr das nächste Mal einen Zug nehmt, fragt euch einfach…'),
    'Но менять правила игры табачникам не впервой.': (
        'But changing the rules of the game is nothing new for Big Tobacco.',
        'Aber die Spielregeln zu ändern, ist für die Tabakkonzerne nichts Neues.'),
    'Ведь главный символ мужской брутальности век назад выводили на рынок... как нежные сигареты для леди.': (
        'After all, the ultimate symbol of rugged masculinity was launched a century ago… as delicate cigarettes for ladies.',
        'Denn das größte Symbol rauer Männlichkeit kam vor hundert Jahren auf den Markt… als zarte Zigaretten für Damen.'),

    # ===================== Глава 3 «Мальборо» (1924) =====================
    'Главный символ мужской брутальности век назад выводили на рынок... как нежные сигареты для леди.': (
        'The ultimate symbol of rugged masculinity was launched a century ago… as delicate cigarettes for ladies.',
        'Das größte Symbol rauer Männlichkeit kam vor hundert Jahren auf den Markt… als zarte Zigaretten für Damen.'),
    'Это «Мальборо», и до ковбойской славы эта марка успела прожить целую жизнь.': (
        'This is Marlboro, and before its cowboy fame, the brand had already lived a whole life.',
        'Das ist Marlboro – und vor dem Cowboy-Ruhm hatte diese Marke schon ein ganzes Leben hinter sich.'),
    'Первые тридцать лет она была дамской: слоган «мягкие, как май», изящная реклама в журналах и красный кончик, на котором не видно помады.': (
        'For its first thirty years, it was a ladies’ brand: the slogan “Mild as May,” elegant magazine ads, and a red tip that hid lipstick.',
        'Die ersten dreißig Jahre war sie eine Damenmarke: der Slogan „Mild as May“, elegante Anzeigen in Magazinen und ein rotes Mundstück, auf dem man keinen Lippenstift sah.'),
    'К пятьдесят четвёртому году её курила горстка женщин — четверть процента рынка, марка почти умерла.': (
        'By 1954, only a handful of women smoked it — a quarter of a percent of the market. The brand was nearly dead.',
        'Bis 1954 rauchte sie nur noch eine Handvoll Frauen – ein Viertelprozent des Marktes. Die Marke war fast tot.'),
    'Спас её страх. Учёные намазали мышей табачной смолой, у мышей выросли опухоли, и Америка впервые со времён Великой депрессии стала курить меньше.': (
        'Fear saved it. Scientists painted mice with tobacco tar, the mice grew tumors, and for the first time since the Great Depression, America started smoking less.',
        'Gerettet hat sie die Angst. Forscher bestrichen Mäuse mit Tabakteer, die Mäuse bekamen Tumore – und Amerika rauchte zum ersten Mal seit der Großen Depression weniger.'),
    'Курильщики бросились к сигаретам с фильтром, только мужчины их стеснялись: это считалось куревом для неженок.': (
        'Smokers rushed to filter cigarettes — only men were embarrassed by them: filters were seen as smokes for sissies.',
        'Raucher stürzten sich auf Filterzigaretten – nur Männer schämten sich dafür: Filter waren was für Weicheier.'),
    'И «Филип Моррис» дарит той же марке вторую жизнь: фильтр, жёсткую пачку, которую открывают со щелчком у всех на виду, и чикагского рекламщика Лео Бёрнетта.': (
        'So Philip Morris gives the same brand a second life: a filter, a hard pack that clicks open in front of everyone, and Chicago ad man Leo Burnett.',
        'Und Philip Morris schenkt derselben Marke ein zweites Leben: einen Filter, eine harte Schachtel, die man vor allen mit einem Klick öffnet, und den Chicagoer Werber Leo Burnett.'),
    'Бёрнетт ставит на рекламу ковбоя — по его словам, самый понятный в Америке символ мужчины.': (
        'Burnett puts a cowboy in the ads — in his words, the most universally understood symbol of a man in America.',
        'Burnett setzt in der Werbung auf einen Cowboy – nach seinen Worten das unverkennbarste Symbol für einen Mann in Amerika.'),
    'Через год бывшая дамская марка уже четвёртая в стране, а в семьдесят втором — первая в мире.': (
        'A year later, the former ladies’ brand is already number four in the country — and in 1972, number one in the world.',
        'Ein Jahr später ist die einstige Damenmarke schon die Nummer vier im Land – und 1972 die Nummer eins der Welt.'),
    'Вот только ковбои с рекламы курили по-настоящему.': (
        'The only thing is, the cowboys in the ads really smoked.',
        'Nur: Die Cowboys aus der Werbung rauchten wirklich.'),
    'Уэйн Макларен выкуривал по полторы пачки в день, в девяностом у него нашли рак лёгких, в последний год жизни он снимался в рекламе против курения и умер в пятьдесят один.': (
        'Wayne McLaren smoked a pack and a half a day. In 1990 he was diagnosed with lung cancer; in the last year of his life he starred in anti-smoking ads, and he died at fifty-one.',
        'Wayne McLaren rauchte anderthalb Schachteln am Tag. 1990 wurde bei ihm Lungenkrebs festgestellt, im letzten Lebensjahr drehte er Anti-Raucher-Spots – und starb mit einundfünfzig.'),
    'Всего от болезней лёгких умерли как минимум четверо ковбоев «Мальборо».': (
        'In total, at least four Marlboro cowboys died of lung disease.',
        'Insgesamt starben mindestens vier Marlboro-Cowboys an Lungenkrankheiten.'),
    'Помните тринадцать миллиардов, которые производитель «Мальборо» отдал за треть «Джула»? Почти все он потом потерял — и спокойно пережил: красно-белая пачка кормит его до сих пор.': (
        'Remember the thirteen billion the maker of Marlboro paid for a third of JUUL? It later lost almost all of it — and shrugged it off: the red-and-white pack still pays the bills to this day.',
        'Erinnert ihr euch an die dreizehn Milliarden, die der Marlboro-Hersteller für ein Drittel von JUUL zahlte? Fast alles hat er später verloren – und es locker verkraftet: Die rot-weiße Schachtel ernährt ihn bis heute.'),
    'А когда курильщики снова испугались дыма, у марки началась третья жизнь — без огня: табак в новой сигарете греет маленький нагреватель.': (
        'And when smokers got scared of smoke again, the brand began its third life — without fire: in the new cigarette, the tobacco is warmed by a tiny heater.',
        'Und als die Raucher wieder Angst vor Rauch bekamen, begann das dritte Leben der Marke – ohne Feuer: Den Tabak in der neuen Zigarette erhitzt ein kleines Heizelement.'),
    'И первые стики к ней тоже назывались… «Мальборо».': (
        'And the first sticks for it were also called… | Marlboro.',
        'Und die ersten Sticks dafür hießen ebenfalls… | Marlboro.'),
    'Без огня — значит, без вреда?': (
        'No fire — so, no harm?',
        'Kein Feuer – also harmlos?'),
}

# надписи в кадре: как их рисует глава (fillText). Ключи — точные строки (собраны прогоном `node capture.mjs <ролик>-en texts`).
# Двухстрочные надписи, которые глава рисует по словам, переведены по строкам (порядок чтения сохранён: «СУД / МИННЕСОТЫ» → «MINNESOTA / COURT»).
STR = {
    # 24.11: в русской версии фильма 16:9 английских слов нет — в EN/DE те же надписи как раньше
    'СИГАРЕТЫ С ФИЛЬТРОМ': ('FILTER CIGARETTES', 'FILTERZIGARETTEN'), 'ТУРЕЦКИЙ ТАБАК': ('TURKISH & DOMESTIC BLEND', 'TÜRKISCHER TABAK'),
    '20 СИГАРЕТ': ('20 CLASS A CIGARETTES', '20 ZIGARETTEN'), 'R.J. REYNOLDS · ТАБАЧНАЯ КОМПАНИЯ': ('R.J. REYNOLDS TOBACCO COMPANY', 'R.J. REYNOLDS TOBACCO COMPANY'),
    'никотиновая соль 1979': ('nicotine salt 1979', 'Nikotinsalz 1979'), 'ДОЛЯ В «ДЖУЛ»': ('STAKE IN JUUL', 'ANTEIL AN JUUL'),
    'МАЛЬБОРО': ('MARLBORO', 'MARLBORO'), 'МАЛЬБОРО × ДЖУЛ': ('MARLBORO × JUUL', 'MARLBORO × JUUL'), 'ДЖУЛ': ('JUUL', 'JUUL'),
    # ---------- глава 1 «Боб» ----------
    'ЧТО ВЫ': ('WHAT DO', 'WAS WISST'), 'ЗНАЕТЕ': ('YOU KNOW', 'IHR'), 'ОБ': ('ABOUT', 'ÜBER'), 'ОДНОРАЗКАХ?': ('DISPOSABLES?', 'EINWEG-VAPES?'),
    'ЧТО': ('WHAT', 'WAS'), 'ВЫ': ('YOU', 'IHR'),
    'СЕЙЧАС': ('NOW', 'JETZT'), 'СУД · АРХИВ': ('COURT · ARCHIVE', 'GERICHT · ARCHIV'), 'СОЛЬ НИКОТИНА': ('NICOTINE SALT', 'NIKOTINSALZ'), 'ЗАПИСКА': ('MEMO', 'MEMO'),
    'ЛАЗЕЙКА ОДНОРАЗОК': ('THE DISPOSABLE LOOPHOLE', 'DIE EINWEG-LÜCKE'),
    'МЕМОРАНДУМ': ('MEMORANDUM', 'MEMORANDUM'), '2 ФЕВРАЛЯ 1973': ('FEBRUARY 2, 1973', '2. FEBRUAR 1973'),
    'ТЕМА: НОВЫЕ МАРКИ СИГАРЕТ ДЛЯ': ('RE: NEW CIGARETTE BRANDS FOR', 'BETREFF: NEUE ZIGARETTENMARKEN'),
    'МОЛОДЁЖНОГО РЫНКА': ('THE YOUTH MARKET', 'FÜR DEN JUGENDMARKT'),
    'Реалистично, если наша компания': ('Realistically, if our Company', 'Realistisch: Wenn unsere Firma'),
    'хочет выжить и процветать': ('is to survive and prosper,', 'überleben und gedeihen will,'),
    'в долгосрочной перспективе,': ('over the long term,', 'muss sie langfristig'),
    'К. ТИГ · ОТДЕЛ ИССЛЕДОВАНИЙ': ('C. TEAGUE · RESEARCH DEPT.', 'C. TEAGUE · FORSCHUNG'),
    'ДОСЬЕ №1': ('FILE NO. 1', 'AKTE NR. 1'), 'К. Э. ТИГ': ('C. E. TEAGUE', 'C. E. TEAGUE'),
    'МЫ ДОЛЖНЫ ПОЛУЧИТЬ': ('WE MUST GET OUR', 'WIR MÜSSEN UNS'), 'СВОЮ ДОЛЮ': ('SHARE OF THE', 'UNSEREN ANTEIL AM'),
    'МОЛОДЁЖНОГО РЫНКА.': ('YOUTH MARKET.', 'JUGENDMARKT SICHERN.'),
    'СЕКРЕТНО': ('SECRET', 'GEHEIM'), 'SECRET': ('SECRET', 'GEHEIM'), 'СЕКРЕТНО · ПРОЕКТ · 1979 ·': ('SECRET · PROJECT · 1979 ·', 'GEHEIM · PROJEKT · 1979 ·'),
    'СЕКРЕТНО · R.J. REYNOLDS · 1973 ·': ('SECRET · R.J. REYNOLDS · 1973 ·', 'GEHEIM · R.J. REYNOLDS · 1973 ·'),
    'МАНГО': ('MANGO', 'MANGO'), 'МЯТА': ('MINT', 'MINZE'), 'КОЛА': ('COLA', 'COLA'),
    'СНИМОК · ГОРЛО': ('X-RAY · THROAT', 'RÖNTGEN · HALS'), 'ПАЦИЕНТ': ('PATIENT', 'PATIENT'), '16 ЛЕТ': ('AGE 16', '16 JAHRE'),
    'ДЕРЁТ ГОРЛО': ('THROAT BURN', 'KRATZT IM HALS'), 'НИКОТИН': ('NICOTINE', 'NIKOTIN'), 'КИСЛОТА': ('ACID', 'SÄURE'),
    'НИКОТИНОВАЯ СОЛЬ': ('NICOTINE SALT', 'NIKOTINSALZ'), 'ДОЗА НИКОТИНА': ('NICOTINE DOSE', 'NIKOTINDOSIS'),
    'МЯГКИЙ ПАР': ('SMOOTH VAPOR', 'SANFTER DAMPF'), 'БЕЗ КАШЛЯ': ('NO COUGHING', 'KEIN HUSTEN'),
    'СОЛЬ': ('SALT', 'SALZ'), 'НИКОТИНОВАЯ': ('NICOTINE', 'NIKOTIN-'),
    'СУД МИННЕСОТЫ · 1998': ('MINNESOTA COURT · 1998', 'GERICHT MINNESOTA · 1998'),
    'СУД': ('MINNESOTA', 'GERICHT'), 'МИННЕСОТЫ': ('COURT', 'MINNESOTA'), 'ВЕСТНИК · 1998': ('THE HERALD · 1998', 'DER KURIER · 1998'),
    'ДОКУМЕНТОВ': ('DOCUMENTS', 'DOKUMENTE'), 'АРХИВ': ('ARCHIVE', 'ARCHIV'), 'ВСКРЫТ': ('OPENED', 'GEÖFFNET'),
    'НИКОТИНОВАЯ СОЛЬ · 1979': ('NICOTINE SALT · 1979', 'NIKOTINSALZ · 1979'),
    'ЗОЛОТЫЕ ВОРОТА': ('GOLDEN GATE', 'GOLDEN GATE'), 'ТИХИЙ ОКЕАН': ('PACIFIC OCEAN', 'PAZIFIK'), 'ЗАЛИВ САН-ФРАНЦИСКО': ('SAN FRANCISCO BAY', 'BUCHT VON SAN FRANCISCO'),
    'ОКЛЕНД': ('OAKLAND', 'OAKLAND'), 'КАЛИФОРНИЯ': ('CALIFORNIA', 'KALIFORNIEN'), 'АРХИВ UCSF': ('UCSF ARCHIVE', 'UCSF-ARCHIV'),
    'ПО СОСЕДСТВУ': ('RIGHT NEXT DOOR', 'GLEICH NEBENAN'), '20–30 МИН НА МАШИНЕ': ('20–30 MIN BY CAR', '20–30 MIN. MIT DEM AUTO'), 'СТЭНФОРД': ('STANFORD', 'STANFORD'),
    'АРХИВ ДОКУМЕНТОВ ТАБАЧНЫХ КОМПАНИЙ': ('TRUTH TOBACCO INDUSTRY DOCUMENTS', 'ARCHIV DER TABAKINDUSTRIE'), 'НАЙТИ': ('SEARCH', 'SUCHEN'),
    'R.J. REYNOLDS · 1979 · НИКОТИНОВАЯ СОЛЬ': ('R.J. REYNOLDS · 1979 · NICOTINE SALT', 'R.J. REYNOLDS · 1979 · NIKOTINSALZ'), 'НАЙДЕНО': ('FOUND', 'GEFUNDEN'),
    '9,5 СМ': ('9.5 CM', '9,5 CM'), 'КАРТРИДЖ': ('POD', 'POD'), 'НАГРЕВАТЕЛЬ': ('HEATER', 'HEIZELEMENT'), 'АККУМУЛЯТОР': ('BATTERY', 'AKKU'),
    'ИНДИКАТОР': ('INDICATOR', 'ANZEIGE'), 'ЛИСТ 1': ('SHEET 1', 'BLATT 1'), 'ФЛЕШКА': ('USB STICK', 'USB-STICK'), 'СОЛЬ · 1979': ('SALT · 1979', 'SALZ · 1979'),
    '1 КАРТРИДЖ': ('1 POD', '1 POD'), '20 СИГАРЕТ = ПАЧКА': ('20 CIGARETTES = 1 PACK', '20 ZIGARETTEN = 1 SCHACHTEL'),
    'НЕ ДЕРЁТ ГОРЛО': ('NO THROAT BURN', 'KRATZT NICHT IM HALS'), 'ЗАВИСИМОСТЬ': ('ADDICTION', 'SUCHT'),
    'СТАРШЕКЛАССНИКИ США · %': ('US HIGH SCHOOLERS · %', 'US-HIGHSCHOOL-SCHÜLER · %'), 'КАЖДЫЙ 4-Й': ('1 IN 4', 'JEDER 4.'),
    'ДОЛЯ В JUUL': ('STAKE IN JUUL', 'ANTEIL AN JUUL'), 'ПЛАН ВЫПОЛНЕН': ('PLAN COMPLETE', 'PLAN ERFÜLLT'),
    '$12,8 МЛРД': ('$12.8B', '12,8 MRD. $'),
    'ЧЕРТЁЖ · 2015': ('BLUEPRINT · 2015', 'BAUPLAN · 2015'), 'СТОЛ · 2015': ('DESK · 2015', 'SCHREIBTISCH · 2015'), 'СНИМОК · ПАР': ('X-RAY · VAPOR', 'RÖNTGEN · DAMPF'),
    'ШКОЛА · США · 2019': ('SCHOOL · USA · 2019', 'SCHULE · USA · 2019'), 'СДЕЛКА · 2018': ('DEAL · 2018', 'DEAL · 2018'), 'ПЛАН · 1973': ('PLAN · 1973', 'PLAN · 1973'),
    'ДЕЛО ОТКРЫТО': ('CASE OPEN', 'FALL ERÖFFNET'), '▶ ТОЛЬКО НА YOUTUBE': ('▶ ONLY ON YOUTUBE', '▶ NUR AUF YOUTUBE'), 'ТОЛЬКО НА YOUTUBE': ('ONLY ON YOUTUBE', 'NUR AUF YOUTUBE'),   # v23.6: штамп шортса главы 1 (без ▶)
    # ---------- глава 2 «Лёд» ----------
    'МАНГО-ЛЁД': ('MANGO ICE', 'MANGO-EIS'), 'ВЕЙПЫ 24/7': ('VAPES 24/7', 'VAPES 24/7'), 'ЗАКОН': ('LAW', 'GESETZ'),
    'ДЕКАБРЬ': ('DECEMBER', 'DEZEMBER'), 'ЯНВАРЬ': ('JANUARY', 'JANUAR'), 'СКАНДАЛ': ('SCANDAL', 'SKANDAL'),
    'ФРУКТЫ': ('FRUIT', 'FRUCHT'), 'ДЕСЕРТЫ': ('DESSERTS', 'DESSERTS'), 'ТАБАК': ('TOBACCO', 'TABAK'), 'МЕНТОЛ': ('MENTHOL', 'MENTHOL'),
    'FDA · США': ('FDA · USA', 'FDA · USA'), 'FDA · США · 2020': ('FDA · USA · 2020', 'FDA · USA · 2020'),
    'КАРТРИДЖНЫЕ': ('CARTRIDGES', 'PODS'), 'ЗАПРЕЩЕНЫ': ('BANNED', 'VERBOTEN'), 'ТАБАК · МЕНТОЛ': ('TOBACCO · MENTHOL', 'TABAK · MENTHOL'),
    'МОЖНО': ('ALLOWED', 'ERLAUBT'), 'ОДНОРАЗОВЫЕ ?': ('DISPOSABLES ?', 'EINWEG-VAPES ?'), 'ЗАПРЕТ ВКУСОВ': ('FLAVOR BAN', 'AROMENVERBOT'),
    'ЗАПРЕТ — ТОЛЬКО ДЛЯ:': ('BAN — ONLY FOR:', 'VERBOT – NUR FÜR:'), 'ВЕЙПОВ СО СМЕННЫМИ': ('VAPES WITH REPLACEABLE', 'VAPES MIT WECHSELBAREN'),
    'КАРТРИДЖАМИ': ('CARTRIDGES', 'PODS'), 'ЦЕЛЬНЫЕ': ('ALL-IN-ONE', 'EINTEILIGE'), 'ОДНОРАЗОВЫЕ': ('DISPOSABLES', 'EINWEG-VAPES'),
    'НЕ УПОМЯНУТЫ': ('NOT MENTIONED', 'NICHT ERWÄHNT'), '«ДЖУЛ» · ВКУСЫ': ('JUUL · FLAVORS', 'JUUL · AROMEN'), 'НЕТ': ('GONE', 'WEG'),
    'ШЭНЬЧЖЭНЬ': ('SHENZHEN', 'SHENZHEN'), 'ВЕЙПЫ · США': ('VAPES · USA', 'VAPES · USA'),
    'ДОЛЯ ОДНОРАЗОК У ПАРЯЩИХ': ('DISPOSABLES’ SHARE AMONG', 'ANTEIL DER EINWEG-VAPES'), 'ШКОЛЬНИКОВ США': ('US TEEN VAPERS', 'BEI US-SCHÜLERN'),
    'АРОМАТ': ('FLAVOR', 'AROMA'), 'ГЛИЦЕРИН': ('GLYCERIN', 'GLYZERIN'), 'ХЛАДАГЕНТ': ('COOLANT', 'KÜHLSTOFF'), 'ПГ': ('PG', 'PG'),
    'синтетический холодок': ('synthetic coolant', 'synthetischer Kühlstoff'), 'РЕЦЕПТОРЫ ГОРЛА': ('THROAT RECEPTORS', 'HALSREZEPTOREN'),
    'СПАЗМ': ('SPASM', 'KRAMPF'), 'ХОЛОД': ('COLD', 'KÄLTE'), 'ЖЖЕНИЕ': ('BURN', 'BRENNEN'),
    '20 СИГАРЕТ': ('20 CIGARETTES', '20 ZIGARETTEN'), 'БАК': ('TANK', 'TANK'), '13 МЛ': ('13 ML', '13 ML'),
    '2 СЕТКИ': ('2 MESH', '2 MESH-'), 'НАГРЕВА': ('COILS', 'COILS'), 'ЗАТЯЖЕК': ('PUFFS', 'ZÜGE'), '= 16 КАРТРИДЖЕЙ': ('= 16 PODS', '= 16 PODS'),
    'БЕЗ ТАБАКА': ('NO TOBACCO', 'OHNE TABAK'), 'В ГОД': ('A YEAR', 'PRO JAHR'), 'ЛАЗЕЙКА': ('LOOPHOLE', 'SCHLUPFLOCH'),
    'СИНТЕТИЧЕСКИЙ ЛЁД': ('SYNTHETIC ICE', 'SYNTHETISCHES EIS'), '5 000 ЗАТЯЖЕК': ('5,000 PUFFS', '5.000 ZÜGE'),
    '«МАЛЬБОРО»: МЯГКИЕ, КАК МАЙ': ('MARLBORO: MILD AS MAY', 'MARLBORO: MILD AS MAY'),
    # ---------- глава 3 «Мальборо» ----------
    'МЯГКИЕ, КАК МАЙ': ('MILD AS MAY', 'MILD AS MAY'), 'СМОЛА': ('TAR', 'TEER'), '0,25 % РЫНКА': ('0.25% OF THE MARKET', '0,25 % DES MARKTES'),
    'КУРЯТ МЕНЬШЕ ↓': ('SMOKING LESS ↓', 'WENIGER RAUCHEN ↓'), 'ДЛЯ НЕЖЕНОК': ('FOR SISSIES', 'FÜR WEICHEIER'), 'ФИЛЬТР': ('FILTER', 'FILTER'),
    'ЛЕО БЁРНЕТТ': ('LEO BURNETT', 'LEO BURNETT'), 'РЕКЛАМЩИК, ЧИКАГО': ('AD MAN, CHICAGO', 'WERBER, CHICAGO'),
    '№ 4 В США': ('#4 IN THE US', 'NR. 4 DER USA'), '№ 1 В МИРЕ': ('#1 IN THE WORLD', 'NR. 1 DER WELT'), 'ПО-НАСТОЯЩЕМУ': ('FOR REAL', 'WIRKLICH'),
    'УЭЙН МАКЛАРЕН': ('WAYNE McLAREN', 'WAYNE McLAREN'), 'КОВБОЙ С РЕКЛАМЫ': ('COWBOY FROM THE ADS', 'COWBOY AUS DER WERBUNG'),
    '1,5 ПАЧКИ В ДЕНЬ': ('1.5 PACKS A DAY', '1,5 SCHACHTELN AM TAG'), 'КАК МИНИМУМ 4': ('AT LEAST 4', 'MINDESTENS 4'), 'БЕЗ ОГНЯ': ('NO FIRE', 'OHNE FEUER'), 'НАГРЕВАТЕЛИ': ('HEATED TOBACCO', 'TABAKERHITZER'),
    'Без огня — без вреда?': ('No fire — no harm?', 'Kein Feuer – also harmlos?'), 'Часть 4 →': ('Part 4 →', 'Teil 4 →'),
    '«МАЛЬБОРО»': ('“MARLBORO”', '„MARLBORO“'), 'МЛРД': ('B', 'MRD.'),
}

# по шаблону (JS RegExp): «$12,8 МЛРД» — счётчик рисуется по цифрам (num), перевод — до раскладки
RULES = {
    'en': [[r'^\$(\d+),(\d+)\s*МЛРД$', '$$$1.$2B']],
    'de': [[r'^\$(\d+),(\d+)\s*МЛРД$', '$1,$2 MRD. $']],
}
