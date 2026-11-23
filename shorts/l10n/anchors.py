"""21.11: пары слов «русское = перевод» для озвучки (l10n/dub.py): в этих местах время русского слова переносится точно на слово
перевода — на них завязаны события в кадре. Начало и конец фразы — пары всегда, остальные слова — по доле текста между парами.
Слово ищется по началу (без знаков и регистра; до 3 букв — целиком), по порядку внутри фразы. Русские — строго по порядку,
слова перевода — не назад. Где порядок в языках разный («сигарет почти не курят» → «smoke cigarettes»), пара — у слова,
на котором событие заметнее, второе слово встаёт по доле текста.
A[язык][рисовка главы][фраза] = 'русское=перевод …'. Фразы и слова, на которые завязана картинка (★): python3 l10n/dub.py pairs <ролик> <язык>."""
A = {'en': {}, 'de': {}}

A['en']['v220'] = {
    'b0': 'после=after айкосом=setback сделали=made ход=smarter',   # v23.5: «But» вырезано (voice/en/ch5.fix3)   # v22.4: мостик 4 → 5 (волна встаёт на «smarter move»)
    'b1': 'Филип=Philip через=a запрета=ban маленькой=small за=a шестнадцать=sixteen',
    'b2': 'нет=isn’t даже=even табака=tobacco',
    's1': 'видно=see слышно=hear пахнут=smell пакетик=pouch губу=lip всё=that’s',
    's2': 'щиплет=stings никотин=nicotine кровь=bloodstream стороны=around заметно=tell дыма=smoke пара=vapor совещании=meeting самолёте=plane',
    's3': 'пакетики=pouches снюсом=snus хотя=but настоящий=real шведский=Swedish снюс=snus табак=tobacco',
    's4': 'нет=no зато=but никотин=nicotine выжимают=extracted из=from табака=tobacco',
    's5': 'шведы=Swedes производитель=maker Мальборо=Marlboro купил=bought компанию=company американским=American заводом=factory Кентукки=Kentucky',
    's6': 'два=Two снюс=pouches смели=flying полок=shelves Америке=America айкосы=IQOS Японии=Japan только=in двадцать=2024 шестьсот=six банок=cans',
    's7': 'двадцать=2025 регулятор=regulator разрешил=approved первыми=first вкусами=flavors мята=mint цитрус=citrus кофе=coffee корица=cinnamon',
    's8': 'Джулу=JUUL запретили=banned',
    's9': 'двадцать=2026 Зину=ZYN разрешили=permission айкосу=IQOS разрешают=doesn’t пор=have говорить=talk риске=risk Зин=ZYN вместо=instead '
          'сигарет=cigarettes ниже=lower рта=mouth лёгких=lung сердца=heart инсульта=stroke',
    's10': 'американские=American школьники=teens курят=smoke снюс=pouches уже=already обогнал=overtaken сигареты=cigarettes',
    's11': 'месяца=months разрешили=stronger покрепче=approved девять=nine одиннадцать=eleven миллиграммов=milligrams вместо=instead трёх=three шести=six',
    'f1': 'никотине=nicotine',
    'f2': 'курят=smoked греют=heated парят=vaped кладут=tucked губу=lip продают=sold бросить=quit',
    'f3': 'Потяните=Pull нить=thread все=all пять=five ведут=lead табачным=tobacco гигантам=giants',   # v22.4
    'f4': 'Вы=You бросаете=quit одно=one продают=sell следующее=next',   # v22.4: без «Змея кусает свой хвост»
    'q': 'Угадаете=guess кто=who’s стоит=behind сигаретами=cigarettes вейпами=vapes снюсом=pouches',   # v22.4
}

A['en']['v210'] = {
    's1': 'Мальборо=Marlboro однажды=once пообещал=promised бросить=quit сигареты=cigarettes',
    's2': 'Выкупил=bought британских=British газетах=newspapers Наше=Our новогоднее=New обещание=resolution мы=we’re пытаемся=trying бросить=give сигареты=cigarettes',
    's3': 'мягко=mildly не=didn’t сдержал=keep',
    # строка 4: английский текст 21.11 — в порядке кадра (глобус: Нагоя, Милан → витрина: сигарета, которую нельзя поджечь)
    's4': 'заранее=early две=2014 японской=Nagoya итальянском=Milan сигарета=cigarette нельзя=can’t поджечь=light',
    's5': 'Табак=tobacco греет=warmed нагреватель=heater вдвое=half холоднее=temperature огня=flame куртка=jacket пахнет=smell пепла=ash затянуться=puff машине=car',
    's6': 'айкос=IQOS комики=comedians популярном=popular японском=Japanese шоу=show айкосы=IQOS смели=sold',
    's7': 'огня=fire значит=so без=no вреда=harm',
    's8': 'год=year швейцарские=Swiss учёные=scientists поймали=captured пар=vapor нашли=found яды=toxins дыме=smoke Многих=Lower одного=even больше=higher никотина=eighty-four',
    's9': 'Статью=paper Дым=Smoke другим=Other именем=Name',
    's10': 'двадцатом=2020 регулятор=regulator разрешил=allowed веществ=chemicals а=but разрешает=won’t',
    's11': 'Рейнольдс=Reynolds семьдесят=1973 искали=looking подсадить=hook подростков=teenagers',
    's12': 'прижились=caught одна=one угольком=carbon съела=burned больше=more трёхсот=three миллионов=million долларов=dollars',
    's13': 'патенты=patents выжили=survived двадцать=2021 торговая=Trade комиссия=Commission решила=ruled айкос=IQOS нарушает=infringed выгнала=kicked Америки=America',
    's14': 'обещание=promise бросить=quit двадцать=2024 айкоса=IQOS тридцать=thirty-two миллиона=million пользователей=users компания=company продала=sold '
           'шестьсот=six миллиардов=billion больше=more годом=year',
    's15': 'Бросают=quit ровно=exactly вы=you',
    'q': 'Угадаете=guess вернулись=came Америку=America',
}

A['en']['v170'] = {   # глава 1 «Боб»: фраза — по первым трём русским словам
    'что вы знаете': 'вы=you знаете=know об=about одноразках=disposable модная=trendy замена=replacement сигаретам=cigarettes манго=mango мяты=mint',
    'а знаете ли': 'знаете=know жидкость=liquid изобрели=invented табачные=tobacco гиганты=giants пятьдесят=fifty',
    'вернемся в 1973': '1973=1973 Табачная=tobacco империя=empire Рейнольдс=Reynolds Camel=Camel Winston=Winston готовит=preparing секретный=secret',
    'главная цель документа': 'документа=document’s звучала=stated',
    'мы должны получить': 'должны=must получить=get долю=share молодёжного=youth рынка=market',
    'но вот проблема': 'проблема=problem обычный=regular дым=smoke едкий=harsh дерёт=burns горло=throats',
    'тогда химики смешали': 'химики=chemists смешали=mixed никотин=nicotine кислотой=acid получили=got соль=salt мягко=smooth убойной=knockout дозе=dose',
    'но электронных сигарет': 'электронных=e-cigarettes тогда=then жидкость=liquid секретную=secret формулу=formula спрятали=went архив=archive',
    'в 1998 году': '1998=1998 суд=court заставил=forced табачников=tobacco раскрыть=reveal тайны=secrets четырнадцать=fourteen миллионов=million '
                   'документов=documents опубликовали=published Калифорнии=California',
    # английский текст 21.11 — в порядке кадра: ноутбук ищет бумаги → «Найдено» → два студента
    'по странному стечению': 'странному=strange стечению=coincidence прямо=right соседству=door Стэнфордским=Stanford университетом=University бумаги=papers '
                             'находят=found два=two студента=students',
    'позже они создают': 'создают=create электронную=e-cigarette флешку=USB внутри=inside соль=salt',
    'один картридж заменял': 'картридж=pod заменял=replaced пачку=pack сигарет=cigarettes мягкий=smooth пар=vapor обжигал=burned горло=throat школьники=teens '
                             'тянули=puffed остановки=nonstop подсаживались=hooked быстрее=faster',
    # английский текст 21.11 — в порядке кадра: треть компании → 13 млрд → выкупил производитель «Мальборо»
    'уже через четыре': 'четыре=four года=years четвёртый=four старшеклассник=students треть=third компании=company тринадцать=thirteen долларов=dollars '
                        'выкупил=bought Мальборо=Marlboro',
    'старый план сработал': 'Старый=old план=plan сработал=worked идеально=perfectly',
    'бумажная сигарета ушла': 'Бумажная=paper сигарета=cigarette прошлое=past табачная=tobacco империя=empire сорвала=hit большой=biggest куш=jackpot истории=history',
    'признайтесь вам ведь': 'сейчас=now захотелось=want затянуться=puff',
    'но джул только': 'Джул=JUUL первая=first пяти=five улик=clues Дальше=From история=story холоднее=colder',   # v22.5
    'захотите бросить вам': 'бросить=quit продадут=sell Причём=And одни=same люди=people кто=who именно=exactly смотрите=watch YouTube=YouTube',
    'так о чем': 'чём=where А=Oh',
}

A['en']['v191'] = {   # глава 2 «Лёд»
    'почему ваша одноразка': 'одноразка=disposable ледяная=icy почему=why продают=sale вейпы=vapes 2020=2020',
    'все из-за одного': 'одного=one слова=word забыли=forgot вписать=put закон=law',
    'январь две тысячи': 'Январь=January 2020=2020 после=after Джулом=JUUL власти=authorities рубят=put вейпы=vapes манго=mango фрукты=fruit десерты=desserts '
                        'мята=mint под=on нож=block',
    'но разверните сам': 'разверните=unfold документ=document запрет=ban прописали=written только=only вейпов=vapes сменными=replaceable картриджами=cartridges',
    'а цельные одноразовые': 'цельные=all-in-one одноразовые=disposables просто=simply упомянуты=mentioned',
    # английский текст 21.11 — в порядке кадра: Шэньчжэнь → конвейеры
    'пока джул убирал': 'Джул=JUUL убирал=pulling вкусы=flavors полок=shelves Шэньчжэне=Shenzhen конвейеры=assembly',
    'пафф бар эйч-кью-ди': 'HQD=HQD потом=then ElfBar=Elf одноразки=disposables накрыли=swept Америку=America волной=wave',
    'всего за год': 'Всего=just год=year доля=share старшеклассников=schoolers выросла=jumped одиннадцать=eleven',
    'и это были': 'это=it уже=longer просто=just вкусы=flavor',
    'в жидкость добавили': 'добавили=added синтетический=synthetic холодок=coolant WS-23=WS-23 он=it обманывает=fools рецепторы=receptors горло=throat '
                           'чувствует=feels лёд=ice дерёт=burn никотин=nicotine',
    'помните один картридж': 'один=one картридж=pod заменял=replaced пачку=pack',
    'а потом одноразки': 'потом=Then одноразки=disposables разрослись=bigger тринадцать=thirteen двойная=dual тысячи=thousands затяжек=puffs',
    'по никотину как': 'никотину=Nicotine-wise шестнадцать=sixteen картриджей=pods',
    'а чтобы обойти': 'чтобы=to обойти=get проверки=rules начали=started варить=brewing пробирке=test без=without табака=tobacco',
    'и когда одноразки': 'когда=once одноразки=disposables приносить=bringing миллиарды=billions долларов=dollars год=year старые=old табачные=tobacco '
                         'корпорации=corporations',
    'запретом хотели отнять': 'Запретом=ban хотели=meant отнять=take вкус=flavor подарили=gave ледяной=icy пар=vapor гигантские=giant баки=tanks никотин=test-tube',
    'но менять правила': 'менять=changing правила=rules игры=game впервой=new',
    'ведь главный символ': 'главный=ultimate символ=symbol мужской=rugged брутальности=masculinity век=century нежные=delicate сигареты=cigarettes леди=ladies',
    'так лазейка две': '2020=2020 стала=became второй=second пяти=five улик=clues разбор=breakdown остальных=other трёх=three ждёт=waiting YouTube=YouTube',   # v22.5
    'так что в': 'следующий=next раз=time затяжку=puff просто=just спросите=ask себя=yourself',
}

A['en']['v200'] = {   # глава 3 «Мальборо» (новая концовка 21.11: строки 1–12, крючок шортса, вопрос q3)
    'это мальборо и': 'Мальборо=Marlboro до=before ковбойской=cowboy славы=fame марка=brand прожить=lived целую=whole жизнь=life',
    'первые тридцать лет': 'Первые=first тридцать=thirty дамской=ladies’ слоган=slogan мягкие=Mild май=May изящная=elegant журналах=magazine красный=red кончик=tip '
                           'котором=that видно=hid помады=lipstick',
    'к пятьдесят четвертому': 'пятьдесят=1954 горстка=handful женщин=women четверть=quarter процента=percent рынка=market марка=brand почти=nearly умерла=dead',
    'спас ее страх': 'страх=saved Учёные=Scientists намазали=painted мышей=mice табачной=tobacco смолой=tar выросли=grew опухоли=tumors впервые=first '
                     'депрессии=Depression стала=started меньше=less',
    'курильщики бросились к': 'бросились=rushed фильтром=filter только=only мужчины=men стеснялись=embarrassed считалось=seen неженок=sissies',
    'и филип моррис': 'Филип=Philip дарит=gives марке=brand вторую=second жизнь=life фильтр=filter жёсткую=hard пачку=pack щелчком=clicks всех=everyone '
                      'чикагского=Chicago рекламщика=ad Лео=Leo Бёрнетта=Burnett',
    'бернетт ставит на': 'ставит=puts ковбоя=cowboy словам=words самый=most понятный=understood символ=symbol мужчины=man',
    'через год бывшая': 'год=year бывшая=former дамская=ladies’ марка=brand уже=already четвёртая=four стране=country семьдесят=1972 первая=one мире=world',
    'вот только ковбои': 'только=only ковбои=cowboys рекламы=ads по-настоящему=really',
    'уэйн макларен выкуривал': 'Макларен=McLaren выкуривал=smoked полторы=pack день=day девяностом=1990 рак=lung последний=last год=year жизни=life '
                               'снимался=starred против=anti-smoking умер=died пятьдесят=fifty-one',
    'всего от болезней': 'Всего=total четверо=four ковбоев=cowboys',
    # счётчик 12,80 → 0,45 крутится от «Почти» до «потерял»: в английском — от «later» до «all»
    'помните тринадцать миллиардов': 'тринадцать=thirteen миллиардов=billion производитель=maker Мальборо=Marlboro отдал=paid треть=third Джула=JUUL Почти=later '
                                     'потерял=all спокойно=shrugged пережил=off пачка=pack кормит=pays до=to сих=this пор=day',
    'главный символ мужской': 'Главный=ultimate символ=symbol мужской=rugged брутальности=masculinity век=century нежные=delicate сигареты=cigarettes леди=ladies',
    'а знаете что': 'знаете=know производитель=maker Мальборо=Marlboro однажды=once пообещал=promised',
}

# ===== 22.11: немецкий (Alexander) — пары по записи voice/de/ch1–5 (dub.py pairs <ролик> de) =====
A['de']['v170'] = {
    'что вы знаете': 'вы=wisst знаете=ihr об=über одноразках=Einweg модная=angesagter замена=Zigarettenersatz паром=Dampf манго=Mango мяты=Minze',
    'а знаете ли': 'знаете=wusstet жидкость=Flüssigkeit изобрели=schon табачные=Tabakriesen гиганты=Tabakriesen',
    'вернемся в 1973': '1973=1973 Табачная=Tabakimperium империя=Tabakimperium Рейнольдс=Reynolds Camel=Camel Winston=Winston готовит=bereitet секретный=geheimen',
    'главная цель документа': 'Главная=Hauptziel документа=Dokuments звучала=stand',
    'мы должны получить': 'Мы=Wir должны=müssen получить=uns свою=unseren долю=Anteil молодёжного=Jugendmarkt рынка=Jugendmarkt',
    'но вот проблема': 'проблема=Problem обычный=Normaler дым=Tabakrauch едкий=scharf дерёт=kratzt горло=Hals',
    'тогда химики смешали': 'химики=mischten смешали=Chemiker никотин=Nikotin кислотой=Säure получили=erhielten соль=Nikotinsalz убойной=brutaler дозе=Dosis',
    'но электронных сигарет': 'электронных=E-Zigaretten тогда=damals жидкость=Flüssigkeit И=Also секретную=geheime формулу=Formel архив=Archiv',
    'в 1998 году': '1998=1998 суд=Gericht табачников=Tabakkonzerne тайны=Geheimnisse четырнадцать=vierzehn миллионов=Millionen документов=Dokumente опубликовали=wurden Калифорнии=Kalifornien',
    'по странному стечению': 'странному=Zufall стечению=wollte прямо=gleich соседству=neben Стэнфордским=Stanford университетом=University бумаги=zwei находят=Studenten два=Papiere студента=entdecken',
    'позже они создают': 'создают=bauen электронную=E-Zigarette флешку=USB-Stick оживает=erwacht соль=Salz',
    'один картридж заменял': 'Один=Ein картридж=Pod заменял=ersetzte пачку=Schachtel сигарет=Zigaretten мягкий=sanfte пар=Dampf горло=Hals школьники=Schüler остановки=Pause подсаживались=wurden быстрее=schneller',
    'уже через четыре': 'четыре=vier года=Jahre США=USA четвёртый=vierte старшеклассник=Highschool-Schüler треть=Drittel компании=Firma тринадцать=dreizehn долларов=Dollar',
    'старый план сработал': 'Старый=alte план=Plan сработал=ging идеально=perfekt',
    'бумажная сигарета ушла': 'Бумажная=Papierzigarette сигарета=Papierzigarette прошлое=Geschichte табачная=Tabakimperium империя=Tabakimperium сорвала=räumte большой=größten куш=Jackpot истории=Geschichte',
    'признайтесь вам ведь': 'сейчас=jetzt захотелось=Lust затянуться=Zug',
    'но джул только': 'Джул=JUUL первая=erste пяти=fünf улик=Indizien Дальше=Ab история=Geschichte холоднее=kälter',
    'захотите бросить вам': 'бросить=aufhören продадут=verkauft Причём=Und одни=dieselben люди=Leute кто=Wer именно=genau смотрите=seht YouTube=YouTube',
    'так о чем': 'чём=wo А=Ach',
}
A['de']['v191'] = {
    'почему ваша одноразка': 'одноразка=Einweg-Vape ледяная=eisig почему=warum продают=verkauft вейпы=Vapes вкусами=Geschmack 2020=2020',
    'все из-за одного': 'одного=einzigen слова=Wortes забыли=vergessen вписать=ins закон=Gesetz',
    'январь две тысячи': 'Январь=Januar 2020=2020 после=Nach скандала=JUUL-Skandal Джулом=JUUL-Skandal власти=kommen США=USA вейпы=Vapes вкусами=Geschmack манго=Mango фрукты=Frucht десерты=Dessert мята=Minze под=unters нож=Fallbeil',
    'но разверните сам': 'разверните=schaut документ=Dokument запрет=Verbot только=nur вейпов=Vapes сменными=wechselbaren картриджами=Pods',
    'а цельные одноразовые': 'А=Und цельные=Einweg-Geräte одноразовые=Stück просто=schlicht упомянуты=erwähnt',
    'пока джул убирал': 'Джул=JUUL вкусы=Geschmacksrichtungen полок=Regalen Шэньчжэне=Shenzhen конвейеры=Fließbänder',
    'пафф бар эйч-кью-ди': 'HQD=HQD потом=dann ElfBar=Elf одноразки=Einweg-Vapes накрыли=überrollten Америку=Amerika волной=Welle',
    'всего за год': 'Всего=nur год=Jahr доля=Anteil старшеклассников=Highschool-Schülern выросла=um одиннадцать=Elffache',
    'и это были': 'это=es уже=längst просто=nur вкусы=Geschmack',
    'в жидкость добавили': 'жидкость=Flüssigkeit добавили=kam синтетический=synthetischer холодок=Kühlstoff WS-23=WS-23 он=er обманывает=täuscht рецепторы=Rezeptoren горло=Hals чувствует=spürt лёд=Eis дерёт=Nikotin-Kratzens никотин=Nikotin-Kratzens',
    'помните один картридж': 'Помните=Wisst один=Ein картридж=Pod заменял=ersetzte пачку=Schachtel',
    'а потом одноразки': 'потом=Dann одноразки=Einweg-Vapes разрослись=größer тринадцать=dreizehn двойная=Doppel-Mesh-Coil тысячи=Tausende затяжек=Züge',
    'по никотину как': 'никотину=Nikotin шестнадцать=sechzehn картриджей=Pods',
    'а чтобы обойти': 'чтобы=um обойти=Regeln проверки=umgehen начали=brauten варить=Nikotin пробирке=Reagenzglas без=ohne табака=Tabakblatt',
    'и когда одноразки': 'когда=als одноразки=Einweg-Vapes миллиарды=Milliarden долларов=Dollar год=Jahr старые=alten табачные=Tabakkonzerne корпорации=Tabakkonzerne',
    'запретом хотели отнять': 'Запретом=Verbot хотели=sollte школьников=Schülern вкус=Geschmack подарили=bekamen ледяной=eisigen пар=Dampf гигантские=riesige баки=Tanks никотин=Nikotin',
    'но менять правила': 'правила=Spielregeln игры=Spielregeln табачникам=Tabakkonzerne впервой=Neues',
    'ведь главный символ': 'главный=größte символ=Symbol мужской=rauer брутальности=Männlichkeit век=hundert выводили=auf как=als нежные=zarte сигареты=Zigaretten для=für леди=Damen',
    'так лазейка две': 'лазейка=Schlupfloch 2020=2020 стала=zum второй=zweiten пяти=fünf улик=Indizien разбор=Die остальных=anderen трёх=drei ждёт=warten YouTube=YouTube',
    'так что в': 'следующий=nächste раз=Mal затяжку=Zug спросите=fragt себя=euch',
}
A['de']['v200'] = {
    'это мальборо и': 'Мальборо=Marlboro до=vor ковбойской=Cowboy-Ruhm славы=Cowboy-Ruhm марка=Marke прожить=schon целую=ganzes жизнь=Leben',
    'первые тридцать лет': 'Первые=ersten тридцать=dreißig дамской=Damenmarke слоган=Slogan мягкие=Mild как=as май=May изящная=elegante реклама=Anzeigen журналах=Magazinen красный=rotes кончик=Mundstück котором=dem не=keinen видно=Lippenstift помады=sah',
    'к пятьдесят четвертому': 'пятьдесят=1954 горстка=Handvoll женщин=Frauen четверть=Viertelprozent процента=Viertelprozent рынка=Marktes марка=Marke почти=fast умерла=tot',
    'спас ее страх': 'Спас=Gerettet страх=Angst Учёные=Forscher намазали=bestrichen мышей=Mäuse табачной=Tabakteer смолой=Tabakteer выросли=bekamen опухоли=Tumore Америка=Amerika впервые=ersten депрессии=Depression меньше=weniger',
    'курильщики бросились к': 'Курильщики=Raucher бросились=stürzten к=auf фильтром=Filterzigaretten только=nur мужчины=Männer стеснялись=schämten считалось=waren неженок=Weicheier',
    'и филип моррис': 'Филип=Philip дарит=schenkt марке=Marke вторую=zweites жизнь=Leben фильтр=Filter жёсткую=harte пачку=Schachtel открывают=man щелчком=Klick виду=öffnet чикагского=Chicagoer рекламщика=Werber Лео=Leo Бёрнетта=Burnett',
    'бернетт ставит на': 'ставит=setzt рекламу=Werbung ковбоя=Cowboy словам=Worten самый=unverkennbarste символ=Symbol мужчины=Mann',
    'через год бывшая': 'год=Jahr бывшая=einstige дамская=Damenmarke марка=Damenmarke уже=schon четвёртая=vier стране=Land семьдесят=1972 первая=eins мире=Welt',
    'вот только ковбои': 'только=Nur ковбои=Cowboys рекламы=Werbung курили=rauchten по-настоящему=wirklich',
    'уэйн макларен выкуривал': 'Уэйн=Wayne Макларен=McLaren выкуривал=rauchte полторы=anderthalb день=Tag девяностом=1990 рак=Lungenkrebs лёгких=Lungenkrebs последний=letzten год=Lebensjahr снимался=drehte рекламе=Anti-Raucher-Spots умер=starb пятьдесят=einundfünfzig один=einundfünfzig',
    'всего от болезней': 'Всего=Insgesamt умерли=starben четверо=vier ковбоев=Marlboro-Cowboys Мальборо=Marlboro-Cowboys',
    'помните тринадцать миллиардов': 'Помните=Erinnert тринадцать=dreizehn миллиардов=Milliarden производитель=Marlboro-Hersteller Мальборо=Marlboro-Hersteller треть=Drittel Джула=JUUL Почти=Fast потерял=verloren спокойно=locker пережил=verkraftet пачка=Schachtel кормит=ernährt до=bis сих=heute пор=heute',
    'главный символ мужской': 'Главный=größte символ=Symbol мужской=rauer брутальности=Männlichkeit век=hundert выводили=auf как=als нежные=zarte сигареты=Zigaretten для=für леди=Damen',
    'а знаете что': 'знаете=wisst производитель=Marlboro-Hersteller Мальборо=Marlboro-Hersteller однажды=einmal пообещал=versprochen',
}
A['de']['v210'] = {
    's1': 'Мальборо=Marlboro-Hersteller однажды=einmal пообещал=versprochen бросить=Zigaretten сигареты=aufzugeben',
    's2': 'Выкупил=kaufte британских=britischen газетах=Zeitungen Наше=Unser новогоднее=Neujahrsvorsatz обещание=Neujahrsvorsatz мы=Wir пытаемся=versuchen бросить=Zigaretten сигареты=aufzugeben',
    's3': 'Слово=Wort мягко=gelinde не=nicht сдержал=gehalten',
    's4': 'Бросать=Aufhören заранее=früher две=2014 японской=japanischen Нагое=Nagoya итальянском=italienischen Милане=Mailand сигарета=Zigarette которую=die нельзя=nicht поджечь=anzünden',
    's5': 'Табак=Tabak греет=erhitzt нагреватель=Heizelement вдвое=halb холоднее=heiß огня=Flamme куртка=Jacke пахнет=riecht пепла=Asche затянуться=ziehen машине=Auto',
    's6': 'айкос=IQOS когда=als шестнадцатом=2016 комики=Comedians популярном=beliebten японском=japanischen шоу=Show айкосы=IQOS смели=ausverkauft',
    's7': 'Без=Kein огня=Feuer значит=also без=harmlos вреда=harmlos',
    's8': 'год=Jahr швейцарские=Schweizer учёные=Forscher поймали=diesen пар=Dampf нашли=fanden яды=Giftstoffe дыме=Rauch Многих=vielen меньше=weniger одного=einem даже=sogar больше=mehr никотина=Nikotin восемьдесят=vierundachtzig процента=Prozent сигареты=Zigarette',
    's9': 'Статью=Studie Дым=Rauch под=unter другим=anderem именем=Namen',
    's10': 'двадцатом=2020 регулятор=US-Behörde разрешил=Hinweis веществ=Schadstoffe а=aber вреда=weniger меньше=schädlich не=nicht',
    's11': 'Помните=Erinnert Рейнольдс=Reynolds семьдесят=1973 искали=suchten подростков=Jugendliche',
    's12': 'Свои=eigenen сигареты=Zigaretten без=ohne не=nicht прижились=durch одна=Eine угольком=Kohlespitze съела=verschlang больше=über трёхсот=dreihundert миллионов=Millionen долларов=Dollar',
    's13': 'их=ihre патенты=Patente двадцать=2021 комиссия=US-Handelskommission решила=dass айкос=IQOS нарушает=verletzt выгнала=warf Америки=Amerika',
    's14': 'обещание=Versprechen бросить=aufzuhören двадцать=2024 айкоса=IQOS тридцать=zweiunddreißig миллиона=Millionen пользователей=Nutzer компания=Konzern продала=verkaufte шестьсот=sechshundertsiebzehn миллиардов=Milliarden больше=mehr годом=Jahr',
    's15': 'Бросают=hören ровно=genauso как=wie вы=ihr',
    'q': 'Угадаете=Ratet вернулись=nach Америку=Amerika',
}
A['de']['v220'] = {
    'b0': 'после=Nach айкосом=IQOS-Rückschlag сделали=machten ход=schlaueren',
    'b1': 'Филип=Philip через=ein запрета=Verbot маленькой=kleinen белой=weißen баночкой=Dose за=für шестнадцать=sechzehn миллиардов=Milliarden',
    'b2': 'нет=nicht даже=mal табака=Tabak',
    's1': 'видно=sieht слышно=hört пахнут=riechen пакетик=Beutel кладут=kommt под=unter губу=Oberlippe всё=fertig',
    's2': 'щиплет=brennt десну=Zahnfleisch никотин=Nikotin кровь=Blut стороны=außen заметно=merkt дыма=Rauch пара=Dampf совещании=Meeting самолёте=Flugzeug',
    's3': 'пакетики=Beutel снюсом=Snus хотя=dabei настоящий=echter шведский=schwedischer снюс=Snus табак=Tabak',
    's4': 'табака=Tabak нет=drin зато=dafür никотин=Nikotin выжимают=gewonnen из=aus табака=Tabak',
    's5': 'шведы=Schweden производитель=Marlboro-Hersteller Мальборо=Marlboro-Hersteller купил=kaufte компанию=Firma целиком=komplett американским=amerikanischem заводом=Werk Кентукки=Kentucky',
    's6': 'два=Zwei снюс=Beutel смели=ganz Америке=Amerika айкосы=IQOS Японии=Japan только=Allein двадцать=2024 шестьсот=sechshundert банок=Dosen',
    's7': 'двадцать=2025 регулятор=US-Behörde разрешил=zu первыми=allererste вкусами=Geschmack мята=Minze цитрус=Zitrus кофе=Kaffee корица=Zimt',
    's8': 'Пять=Fünf Джулу=JUUL вкусы=Geschmacksrichtungen запретили=verboten',
    's9': 'двадцать=2026 Зину=ZYN айкосу=IQOS до=bis пор=heute говорить=über риске=Risiko Зин=ZYN вместо=statt сигарет=Zigaretten ниже=geringeres рта=Mund лёгких=Lungenkrebs сердца=Herzkrankheiten инсульта=Schlaganfall',
    's10': 'только=Nur американские=Amerikanische школьники=Schüler не=kaum курят=Zigaretten снюс=Beutel уже=schon обогнал=überholt',
    's11': 'два=zwei месяца=Monate разрешили=stärkere снюс=Beutel покрепче=zugelassen девять=neun одиннадцать=elf миллиграммов=Milligramm вместо=statt трёх=drei шести=sechs',
    'f1': 'Так=Also что=was вы=wisst знаете=ihr о=über никотине=Nikotin',
    'f2': 'курят=raucht греют=erhitzt парят=dampft кладут=unter губу=Lippe продают=als бросить=Aufhören',
    'f3': 'Потяните=Zieht нить=Faden все=alle пять=fünf ведут=führen к=zu табачным=Tabakriesen гигантам=Tabakriesen',
    'f4': 'Вы=Ihr бросаете=hört одно=einem продают=verkaufen следующее=nächste',
    'q': 'Угадаете=Ratet кто=wer стоит=hinter сигаретами=Zigaretten вейпами=Vapes снюсом=Nikotinbeuteln',
}
