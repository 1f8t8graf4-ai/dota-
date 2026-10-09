// Бот «Языки по кино» (@languagegamesbot) — Cloudflare Worker, версия 12.0
// ОДИН воркер на всё: бот, онлайн-игры, админ-панель, статистика, напоминания и (с 12.0) дуэли по сценам + сброс прогресса.
// Отдельный воркер kino-pvp больше НЕ нужен — если ставил, его можно удалить.
//
// Переменные в настройках воркера:
//   BOT_TOKEN      (секрет) — токен от @BotFather
//   APP_URL        (текст)  — адрес игры: https://1f8t8graf4-ai.github.io/dota-/
//   WEBHOOK_SECRET (секрет) — любая строка из латиницы, цифр, - и _
// Необязательные:
//   APP_LINK       (текст)  — ссылка на мини-апп, по умолчанию https://t.me/languagegamesbot/languagedota2
//   BOT_USERNAME   (текст)  — имя бота без @, по умолчанию languagegamesbot
//   WELCOME_IMG    (текст)  — картинка приветствия, по умолчанию APP_URL + img/welcome.jpg
//   ADMIN_ID       (текст)  — Telegram ID организатора (узнать: /myid). Если нет — 876754050 (Андрей)
//   TOUR_PRIZE     (текст)  — приз турнира, например «5 USDT за 1 место»
// База D1, подключённая к воркеру под именем DB, — для онлайн-игр, турнира, админки, дуэлей, статистики. Таблицы создаются сами.
// Cron (Triggers → Cron «0 * * * *») — напоминания о повторении.
// После каждого обновления кода открой один раз: https://<воркер>/setup?secret=<WEBHOOK_SECRET>

// Приветствие: одна картинка, короткий текст и одна главная кнопка. Всё остальное — внутри приложения.
const esc = (s) => String(s || '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const WELCOME = (name) => `<b>Привет${name ? ', ' + esc(name) : ''}!</b>

Английский и немецкий — по сценам из фильмов и сериалов.

🎬 Смотришь сцену с двойными субтитрами
💬 Разбираешь живые фразы и проверяешь себя
🎧 Слушаешь саундтрек, пока учишь
🃏 Играешь с друзьями: дуэль, «Шпион», карты

<i>Первая сцена — пара минут.</i>`;

const HELP = `Что умеет бот:

/start — открыть приложение
/cards — карточная дуэль (с компьютером или с другом онлайн)
/spy — «Шпион» с друзьями по ссылке
/duel — дуэль прямо в чате: 10 вопросов по 20 секунд, в конце таблица
/word — слово дня

В группе: /quiz — квиз в чат, /tour — турнир недели.
Всё остальное — внутри приложения.`;

// Слова для квизов и турнира: [английский, немецкий, русский, подсказка, группа]
const QUIZ = [
  ["to heal","heilen","лечить","Healing Salve лечит героя.","wv"],
  ["to protect","schützen","защищать","Ring of Protection, кольцо защиты.","wv"],
  ["to attack","angreifen","атаковать","Blades of Attack, клинки атаки.","wv"],
  ["to hide","sich verstecken","прятаться","Shadow Blade прячет героя в невидимость.","wv"],
  ["to escape","fliehen","убегать, спасаться","С Blink Dagger легко спастись.","wv"],
  ["to steal","stehlen","красть","Rubick крадёт заклинания врагов.","wv"],
  ["to throw","werfen","бросать","Tiny бросает врагов умением Toss.","wv"],
  ["to jump","springen","прыгать","Mirana прыгает умением Leap.","wv"],
  ["to fly","fliegen","летать","Batrider летает над полем боя.","wv"],
  ["to burn","brennen","гореть, жечь","Radiance жжёт всех врагов рядом.","wv"],
  ["to freeze","einfrieren","замораживать","Crystal Maiden замораживает врага.","wv"],
  ["to break","brechen","ломать","Mana Break ломает ману врага.","wv"],
  ["to catch","fangen","ловить","Pudge ловит врагов крюком.","wv"],
  ["to pull","ziehen","тянуть","Batrider тянет врага лассо.","wv"],
  ["to push","schieben","толкать","Force Staff толкает героя вперёд.","wv"],
  ["to buy","kaufen","покупать","Предметы покупают в лавке.","wv"],
  ["to sell","verkaufen","продавать","Ненужный предмет можно продать.","wv"],
  ["to win","gewinnen","побеждать","Разрушил вражеский трон — победил.","wv"],
  ["to lose","verlieren","проигрывать","Потерял свой трон — проиграл.","wv"],
  ["to help","helfen","помогать","Саппорт помогает команде.","wv"],
  ["to wait","warten","ждать","Иногда лучше подождать союзников.","wv"],
  ["to follow","folgen","следовать","Follow me значит «за мной».","wv"],
  ["to return","zurückkehren","возвращаться","Town Portal Scroll возвращает на базу.","wv"],
  ["to carry","tragen","нести","Отсюда роль керри: герой, который «несёт» команду.","wv"],
  ["to support","unterstützen","поддерживать","Отсюда роль саппорт, например Disruptor.","wv"],
  ["to see","sehen","видеть","Observer Ward помогает видеть врагов.","wv"],
  ["to kill","töten","убивать","За убийство героя дают золото.","wv"],
  ["to die","sterben","умирать","Умер — ждёшь возрождения.","wv"],
  ["to fight","kämpfen","сражаться","Legion Commander сражается один на один.","wv"],
  ["to run","rennen","бегать","Phase Boots помогают бегать быстрее.","wv"],
  ["to sleep","schlafen","спать","Bane усыпляет врага умением Nightmare.","wv"],
  ["to forget","vergessen","забывать","Oblivion Staff: oblivion — это забвение.","wv"],
  ["to shine","leuchten","светить, сиять","Keeper of the Light светит умением Illuminate.","wv"],
  ["to grow","wachsen","расти","Treant выращивает корни и деревья.","wv"],
  ["to travel","reisen","путешествовать","Boots of Travel, сапоги путешествий.","wv"],
  ["to summon","beschwören","призывать","Lone Druid призывает медведя.","wv"],
  ["strong","stark","сильный","Belt of Strength делает сильнее.","wa"],
  ["weak","schwach","слабый","В начале игры все герои слабые.","wa"],
  ["fast","schnell","быстрый","Boots of Speed делают быстрее.","wa"],
  ["slow","langsam","медленный","Лёд делает врага медленным.","wa"],
  ["invisible","unsichtbar","невидимый","Glimmer Cape делает союзника невидимым.","wa"],
  ["dangerous","gefährlich","опасный","Рошан очень опасный.","wa"],
  ["rich","reich","богатый","С Hand of Midas становишься богаче.","wa"],
  ["poor","arm","бедный","Без золота герой бедный.","wa"],
  ["rare","selten","редкий","Divine Rapier покупают редко.","wa"],
  ["sacred","heilig","священный","Sacred Relic, священная реликвия.","wa"],
  ["brave","mutig","храбрый","Храбрый герой первым идёт в бой.","wa"],
  ["angry","wütend","злой, сердитый","Ursa в ярости бьёт сильнее.","wa"],
  ["hungry","hungrig","голодный","Pudge всегда голодный.","wa"],
  ["tired","müde","уставший","После долгой игры все уставшие.","wa"],
  ["empty","leer","пустой","Пустой Bottle в игре называется Empty Bottle.","wa"],
  ["full","voll","полный","С руной Bottle снова полный.","wa"],
  ["true","wahr","истинный, правдивый","Gem of True Sight, камень истинного зрения.","wa"],
  ["alive","lebendig","живой","Treant даёт союзнику Living Armor, живую броню.","wa"],
  ["dead","tot","мёртвый","Мёртвый герой ждёт возрождения.","wa"],
  ["calm","ruhig","спокойный","Tranquil Boots: tranquil тоже значит «спокойный».","wa"],
  ["heavy","schwer","тяжёлый","Ogre Axe, тяжёлый топор огра.","wa"],
  ["hidden","versteckt","спрятанный","Враг может прятаться в лесу.","wa"],
  ["power","die Macht","сила, власть","Power Treads, сапоги силы.","wn"],
  ["time","die Zeit","время","Faceless Void останавливает время.","wn"],
  ["weapon","die Waffe","оружие","Divine Rapier — самое сильное оружие.","wn"],
  ["war","der Krieg","война","Свет и Тьма ведут вечную войну.","wn"],
  ["peace","der Frieden","мир (не война)","Противоположность войны.","wn"],
  ["world","die Welt","мир, свет","Outworld Devourer пришёл из внешнего мира.","wn"],
  ["wall","die Mauer","стена (каменная)","Базу защищают стены и башни.","wn"],
  ["friend","der Freund","друг","С другом играть веселее.","wn"],
  ["danger","die Gefahr","опасность","Сигнал опасности на карте.","wn"],
  ["map","die Karte","карта","Почаще смотри на мини-карту.","wn"],
  ["key","der Schlüssel","ключ","Ключ к победе — командная игра.","wn"],
  ["coin","die Münze","монета","Золото в игре — это монеты.","wn"],
  ["mistake","der Fehler","ошибка","На ошибках учатся.","wn"],
  ["luck","das Glück","удача","Good luck значит «удачи».","wn"],
  ["fear","die Angst","страх","Некоторые умения пугают врага и заставляют бежать.","wn"],
  ["courage","der Mut","смелость","Medallion of Courage, медальон смелости.","wn"],
  ["vision","die Sicht","обзор, видимость","Варды дают обзор.","wn"],
  ["heaven","der Himmel","небо, небеса","Heaven's Halberd, алебарда небес.","wn"],
  ["moon","der Mond","луна","Luna и Mirana связаны с луной.","wn"],
  ["stone","der Stein","камень","Medusa превращает врагов в камень.","wn"],
  ["tree","der Baum","дерево","Tango позволяет съесть дерево.","wn"],
  ["fire","das Feuer","огонь","Lina управляет огнём.","wn"],
  ["ice","das Eis","лёд","Ancient Apparition бьёт ледяным взрывом.","wn"],
  ["water","das Wasser","вода","Kunkka вызывает поток воды.","wn"],
  ["gift","das Geschenk","подарок","Не путай: немецкое Gift — это яд.","wn"],
  ["Witch","die Hexe","ведьма","Как в имени Witch Doctor.","h"],
  ["Doctor","der Arzt","врач","Как в имени Witch Doctor.","h"],
  ["Knight","der Ritter","рыцарь","Как в имени Dragon Knight.","h"],
  ["King","der König","король","Как в имени Wraith King.","h"],
  ["Queen","die Königin","королева","Как в имени Queen of Pain.","h"],
  ["Pain","der Schmerz","боль","Как в имени Queen of Pain.","h"],
  ["Night","die Nacht","ночь","Как в имени Night Stalker.","h"],
  ["Light","das Licht","свет","Как в имени Keeper of the Light.","h"],
  ["Keeper","der Hüter","хранитель","Как в имени Keeper of the Light.","h"],
  ["Winter","der Winter","зима","Как в имени Winter Wyvern.","h"],
  ["Sand","der Sand","песок","Как в имени Sand King.","h"],
  ["Hunter","der Jäger","охотник","Как в имени Bounty Hunter.","h"],
  ["Bounty","das Kopfgeld","награда за голову","Как в имени Bounty Hunter.","h"],
  ["Beast","die Bestie","зверь","Как в имени Beastmaster.","h"],
  ["master","der Meister","хозяин, мастер","Как в имени Beastmaster.","h"],
  ["Nature","die Natur","природа","Как в имени Nature's Prophet.","h"],
  ["Prophet","der Prophet","пророк","Как в имени Nature's Prophet.","h"],
  ["Dark","dunkel","тёмный","Как в имени Dark Seer.","h"],
  ["Seer","der Seher","провидец","Как в имени Dark Seer.","h"],
  ["Ancient","uralt","древний","Как в имени Ancient Apparition.","h"],
  ["Elder","der Älteste","старейшина","Как в имени Elder Titan.","h"],
  ["Tide","die Flut","прилив","Как в имени Tidehunter.","h"],
  ["ranger","der Waldläufer","следопыт","Как в имени Windranger.","h"],
  ["Monkey","der Affe","обезьяна","Как в имени Monkey King.","h"],
  ["Lone","einsam","одинокий","Как в имени Lone Druid.","h"],
  ["Brew","das Gebräu","варево, напиток","Как в имени Brewmaster.","h"],
  ["Vengeful","rachsüchtig","мстительный","Как в имени Vengeful Spirit.","h"],
  ["Spirit","der Geist","дух","Как в имени Vengeful Spirit.","h"],
  ["Dawn","die Morgendämmerung","рассвет","Как в имени Dawnbreaker.","h"],
  ["Protector","der Beschützer","защитник","Как в имени Treant Protector.","h"],
  ["Faceless","gesichtslos","безликий","Как в имени Faceless Void.","h"],
  ["Commander","der Kommandant","командир","Как в имени Legion Commander.","h"],
  ["Assassin","der Attentäter","наёмный убийца","Как в имени Templar Assassin.","h"],
  ["Maiden","das Mädchen","дева, девушка","Как в имени Crystal Maiden.","h"],
  ["Ember","die Glut","тлеющий уголь","Как в имени Ember Spirit.","h"],
  ["Storm","der Sturm","буря","Как в имени Storm Spirit.","h"],
  ["Silence","die Stille","тишина","Как в имени Silencer.","h"],
  ["stealer","der Dieb","вор","Как в имени Lifestealer.","h"],
  ["seeker","der Sucher","искатель","Как в имени Bloodseeker.","h"],
  ["Clock","die Uhr","часы","Как в имени Clockwerk.","h"],
  ["saw","die Säge","пила","Как в имени Timbersaw.","h"],
  ["Timber","das Holz","древесина","Как в имени Timbersaw.","h"],
  ["Tiny","winzig","крошечный","Как в имени Tiny.","h"],
  ["Warlock","der Hexenmeister","колдун","Как в имени Warlock.","h"],
  ["Enchantress","die Zauberin","чародейка","Как в имени Enchantress.","h"],
  ["Bat","die Fledermaus","летучая мышь","Как в имени Batrider.","h"],
  ["rider","der Reiter","всадник","Как в имени Batrider.","h"],
  ["Venom","das Gift","яд","Как в имени Venomancer. Не путай: немецкое Gift — это яд, а подарок по-немецки das Geschenk.","h"],
  ["Razor","das Rasiermesser","бритва","Как в имени Razor.","h"],
  ["Weaver","der Weber","ткач","Как в имени Weaver.","h"],
  ["Primal","urzeitlich","первобытный","Как в имени Primal Beast.","h"],
  ["Undying","unsterblich","бессмертный","Как в имени Undying.","h"],
  ["Grim","finster","мрачный","Как в имени Grimstroke.","h"],
  ["Hoodwink","täuschen","обманывать","Как в имени Hoodwink.","h"],
  ["Spectre","das Gespenst","привидение","Как в имени Spectre.","h"],
  ["Warlord","der Kriegsherr","военачальник","Как в имени Troll Warlord.","h"],
  ["Fiend","der Unhold","демон, изверг","Как в имени Shadow Fiend.","h"],
  ["Warden","der Wärter","надзиратель","Как в имени Arc Warden.","h"],
  ["Devourer","der Verschlinger","пожиратель","Как в имени Outworld Devourer.","h"],
  ["Willow","die Weide","ива","Как в имени Dark Willow.","h"],
  ["Tusk","der Stoßzahn","бивень","Как в имени Tusk.","h"],
  ["Tinker","der Bastler","мастер-самоучка","Как в имени Tinker.","h"],
  ["Earth","die Erde","земля","Как в имени Earthshaker.","h"],
  ["Disruptor","der Störer","нарушитель","Как в имени Disruptor. Disrupt значит «нарушать, срывать».","h"],
  ["Good luck!","Viel Glück!","Удачи!","","p"],
  ["Well done!","Gut gemacht!","Молодец!","","p"],
  ["Thank you very much!","Vielen Dank!","Большое спасибо!","","p"],
  ["Sorry, my mistake.","Entschuldigung, mein Fehler.","Извини, это моя ошибка.","","p"],
  ["Wait for me!","Warte auf mich!","Подожди меня!","","p"],
  ["Follow me!","Folge mir!","Иди за мной!","","p"],
  ["Be careful!","Sei vorsichtig!","Будь осторожен!","","p"],
  ["I need help!","Ich brauche Hilfe!","Мне нужна помощь!","","p"],
  ["I'm coming!","Ich komme!","Я иду!","","p"],
  ["Where are you?","Wo bist du?","Где ты?","","p"],
  ["Stay together!","Bleibt zusammen!","Держимся вместе!","","p"],
  ["Retreat!","Rückzug!","Отступаем!","","p"],
  ["Don't give up!","Gib nicht auf!","Не сдавайся!","","p"],
  ["Nice try.","Guter Versuch.","Хорошая попытка.","","p"],
  ["See you later!","Bis später!","До встречи!","","p"],
  ["I'm ready.","Ich bin bereit.","Я готов.","","p"],
  ["Not yet.","Noch nicht.","Ещё нет.","","p"],
  ["Hurry up!","Beeil dich!","Поторопись!","","p"],
  ["Behind you!","Hinter dir!","Сзади тебя!","","p"],
  ["Watch out!","Pass auf!","Берегись!","","p"],
  ["Good game!","Gutes Spiel!","Хорошая игра!","","p"],
  ["Well played!","Gut gespielt!","Хорошо сыграно!","","p"],
  ["I don't understand.","Ich verstehe das nicht.","Я не понимаю.","","p"],
  ["Can you repeat that?","Kannst du das wiederholen?","Можешь повторить?","","p"],
  ["What's our plan?","Was ist unser Plan?","Какой у нас план?","","p"],
  ["We can win this!","Wir können das gewinnen!","Мы можем победить!","","p"],
  ["Let's attack now.","Lass uns jetzt angreifen.","Давай атакуем сейчас.","","p"],
  ["Defend the base!","Verteidigt die Basis!","Защищайте базу!","","p"],
  ["I don't have any mana.","Ich habe kein Mana.","У меня нет маны.","","p"],
  ["I'll be right back.","Ich bin gleich zurück.","Сейчас вернусь.","","p"],
  ["I agree.","Einverstanden.","Согласен.","","p"],
  ["Good idea!","Gute Idee!","Хорошая идея!","","p"]
];

// Герои, предметы и умения для «Шпиона»: [название, ключ иконки]
const SPY_HEROES=[["Abaddon","abaddon"],["Alchemist","alchemist"],["Ancient Apparition","ancient_apparition"],["Anti-Mage","antimage"],["Arc Warden","arc_warden"],["Axe","axe"],["Bane","bane"],["Batrider","batrider"],["Beastmaster","beastmaster"],["Bloodseeker","bloodseeker"],["Bounty Hunter","bounty_hunter"],["Brewmaster","brewmaster"],["Bristleback","bristleback"],["Broodmother","broodmother"],["Centaur Warrunner","centaur"],["Chaos Knight","chaos_knight"],["Chen","chen"],["Clinkz","clinkz"],["Clockwerk","rattletrap"],["Crystal Maiden","crystal_maiden"],["Dark Seer","dark_seer"],["Dark Willow","dark_willow"],["Dawnbreaker","dawnbreaker"],["Dazzle","dazzle"],["Death Prophet","death_prophet"],["Disruptor","disruptor"],["Doom","doom_bringer"],["Dragon Knight","dragon_knight"],["Drow Ranger","drow_ranger"],["Earth Spirit","earth_spirit"],["Earthshaker","earthshaker"],["Elder Titan","elder_titan"],["Ember Spirit","ember_spirit"],["Enchantress","enchantress"],["Enigma","enigma"],["Faceless Void","faceless_void"],["Grimstroke","grimstroke"],["Gyrocopter","gyrocopter"],["Hoodwink","hoodwink"],["Huskar","huskar"],["Invoker","invoker"],["Io","wisp"],["Jakiro","jakiro"],["Juggernaut","juggernaut"],["Keeper of the Light","keeper_of_the_light"],["Kez","kez"],["Kunkka","kunkka"],["Largo","largo"],["Legion Commander","legion_commander"],["Leshrac","leshrac"],["Lich","lich"],["Lifestealer","life_stealer"],["Lina","lina"],["Lion","lion"],["Lone Druid","lone_druid"],["Luna","luna"],["Lycan","lycan"],["Magnus","magnataur"],["Marci","marci"],["Mars","mars"],["Medusa","medusa"],["Meepo","meepo"],["Mirana","mirana"],["Monkey King","monkey_king"],["Morphling","morphling"],["Muerta","muerta"],["Naga Siren","naga_siren"],["Nature's Prophet","furion"],["Necrophos","necrolyte"],["Night Stalker","night_stalker"],["Nyx Assassin","nyx_assassin"],["Ogre Magi","ogre_magi"],["Omniknight","omniknight"],["Oracle","oracle"],["Outworld Devourer","obsidian_destroyer"],["Pangolier","pangolier"],["Phantom Assassin","phantom_assassin"],["Phantom Lancer","phantom_lancer"],["Phoenix","phoenix"],["Primal Beast","primal_beast"],["Puck","puck"],["Pudge","pudge"],["Pugna","pugna"],["Queen of Pain","queenofpain"],["Razor","razor"],["Riki","riki"],["Ring Master","ringmaster"],["Rubick","rubick"],["Sand King","sand_king"],["Shadow Demon","shadow_demon"],["Shadow Fiend","nevermore"],["Shadow Shaman","shadow_shaman"],["Silencer","silencer"],["Skywrath Mage","skywrath_mage"],["Slardar","slardar"],["Slark","slark"],["Snapfire","snapfire"],["Sniper","sniper"],["Spectre","spectre"],["Spirit Breaker","spirit_breaker"],["Storm Spirit","storm_spirit"],["Sven","sven"],["Techies","techies"],["Templar Assassin","templar_assassin"],["Terrorblade","terrorblade"],["Tidehunter","tidehunter"],["Timbersaw","shredder"],["Tinker","tinker"],["Tiny","tiny"],["Treant Protector","treant"],["Troll Warlord","troll_warlord"],["Tusk","tusk"],["Underlord","abyssal_underlord"],["Undying","undying"],["Ursa","ursa"],["Vengeful Spirit","vengefulspirit"],["Venomancer","venomancer"],["Viper","viper"],["Visage","visage"],["Void Spirit","void_spirit"],["Warlock","warlock"],["Weaver","weaver"],["Windranger","windrunner"],["Winter Wyvern","winter_wyvern"],["Witch Doctor","witch_doctor"],["Wraith King","skeleton_king"],["Zeus","zuus"]];
const SPY_ITEMS=[["Tango","tango"],["Healing Salve","flask"],["Clarity","clarity"],["Faerie Fire","faerie_fire"],["Enchanted Mango","enchanted_mango"],["Iron Branch","branches"],["Town Portal Scroll","tpscroll"],["Smoke of Deceit","smoke_of_deceit"],["Dust of Appearance","dust"],["Observer Ward","ward_observer"],["Sentry Ward","ward_sentry"],["Bottle","bottle"],["Magic Stick","magic_stick"],["Magic Wand","magic_wand"],["Quelling Blade","quelling_blade"],["Wraith Band","wraith_band"],["Bracer","bracer"],["Null Talisman","null_talisman"],["Soul Ring","soul_ring"],["Infused Raindrops","infused_raindrop"],["Cheese","cheese"],["Aegis of the Immortal","aegis"],["Gem of True Sight","gem"],["Wind Lace","wind_lace"],["Boots of Speed","boots"],["Phase Boots","phase_boots"],["Power Treads","power_treads"],["Arcane Boots","arcane_boots"],["Tranquil Boots","tranquil_boots"],["Boots of Travel","travel_boots"],["Guardian Greaves","guardian_greaves"],["Boots of Bearing","boots_of_bearing"],["Mekansm","mekansm"],["Pipe of Insight","pipe"],["Glimmer Cape","glimmer_cape"],["Force Staff","force_staff"],["Ghost Scepter","ghost"],["Eul's Scepter of Divinity","cyclone"],["Lotus Orb","lotus_orb"],["Solar Crest","solar_crest"],["Spirit Vessel","spirit_vessel"],["Urn of Shadows","urn_of_shadows"],["Holy Locket","holy_locket"],["Vladmir's Offering","vladmir"],["Drum of Endurance","ancient_janggo"],["Aether Lens","aether_lens"],["Rod of Atos","rod_of_atos"],["Veil of Discord","veil_of_discord"],["Pavise","pavise"],["Crimson Guard","crimson_guard"],["Vanguard","vanguard"],["Helm of the Dominator","helm_of_the_dominator"],["Helm of the Overlord","helm_of_the_overlord"],["Hand of Midas","hand_of_midas"],["Blink Dagger","blink"],["Arcane Blink","arcane_blink"],["Swift Blink","swift_blink"],["Overwhelming Blink","overwhelming_blink"],["Shadow Blade","invis_sword"],["Silver Edge","silver_edge"],["Black King Bar","black_king_bar"],["Blade Mail","blade_mail"],["Battle Fury","bfury"],["Maelstrom","maelstrom"],["Mjollnir","mjollnir"],["Gleipnir","gungir"],["Desolator","desolator"],["Daedalus","greater_crit"],["Crystalys","lesser_crit"],["Divine Rapier","rapier"],["Butterfly","butterfly"],["Satanic","satanic"],["Skull Basher","basher"],["Abyssal Blade","abyssal_blade"],["Monkey King Bar","monkey_king_bar"],["Eye of Skadi","skadi"],["Heart of Tarrasque","heart"],["Assault Cuirass","assault"],["Shiva's Guard","shivas_guard"],["Linken's Sphere","sphere"],["Manta Style","manta"],["Sange and Yasha","sange_and_yasha"],["Kaya and Sange","kaya_and_sange"],["Yasha and Kaya","yasha_and_kaya"],["Diffusal Blade","diffusal_blade"],["Echo Sabre","echo_sabre"],["Mask of Madness","mask_of_madness"],["Armlet of Mordiggian","armlet"],["Radiance","radiance"],["Refresher Orb","refresher"],["Octarine Core","octarine_core"],["Scythe of Vyse","sheepstick"],["Orchid Malevolence","orchid"],["Bloodthorn","bloodthorn"],["Nullifier","nullifier"],["Aeon Disk","aeon_disk"],["Wind Waker","wind_waker"],["Ethereal Blade","ethereal_blade"],["Dagon","dagon"],["Necronomicon","necronomicon"],["Meteor Hammer","meteor_hammer"],["Aghanim's Scepter","ultimate_scepter"],["Aghanim's Shard","aghanims_shard"],["Moon Shard","moon_shard"],["Hurricane Pike","hurricane_pike"],["Dragon Lance","dragon_lance"],["Heaven's Halberd","heavens_halberd"],["Sacred Relic","relic"],["Ogre Axe","ogre_axe"],["Demon Edge","demon_edge"],["Mithril Hammer","mithril_hammer"],["Hyperstone","hyperstone"],["Ultimate Orb","ultimate_orb"],["Mystic Staff","mystic_staff"],["Perseverance","pers"],["Soul Booster","soul_booster"],["Bloodstone","bloodstone"],["Khanda","angels_demise"],["Phylactery","phylactery"],["Harpoon","harpoon"],["Disperser","disperser"],["Falcon Blade","falcon_blade"],["Orb of Corrosion","orb_of_corrosion"],["Mage Slayer","mage_slayer"],["Witch Blade","witch_blade"],["Kaya","kaya"],["Sange","sange"],["Yasha","yasha"],["Eternal Shroud","eternal_shroud"],["Blood Grenade","blood_grenade"]];
const SPY_SKILLS=[["Lightning Bolt","zuus_lightning_bolt"],["Thundergod's Wrath","zuus_thundergods_wrath"],["Sun Strike","invoker_sun_strike"],["Tornado","invoker_tornado"],["Ice Wall","invoker_ice_wall"],["Ball Lightning","storm_spirit_ball_lightning"],["Dragon Slave","lina_dragon_slave"],["Laguna Blade","lina_laguna_blade"],["Requiem of Souls","nevermore_requiem"],["Shadow Strike","queenofpain_shadow_strike"],["Dream Coil","puck_dream_coil"],["Split Earth","leshrac_split_earth"],["Rolling Thunder","pangolier_gyroshell"],["Blade Fury","juggernaut_blade_fury"],["Healing Ward","juggernaut_healing_ward"],["Stifling Dagger","phantom_assassin_stifling_dagger"],["Mana Break","antimage_mana_break"],["Chronosphere","faceless_void_chronosphere"],["Shadow Dance","slark_shadow_dance"],["Battle Trance","troll_warlord_battle_trance"],["God's Strength","sven_gods_strength"],["Rage","life_stealer_rage"],["Thirst","bloodseeker_thirst"],["Stone Gaze","medusa_stone_gaze"],["Eclipse","luna_eclipse"],["Assassinate","sniper_assassinate"],["Berserker's Call","axe_berserkers_call"],["Arena of Blood","mars_arena_of_blood"],["Ravage","tidehunter_ravage"],["Black Hole","enigma_black_hole"],["Duel","legion_commander_duel"],["Hoof Stomp","centaur_hoof_stomp"],["Flaming Lasso","batrider_flaming_lasso"],["Void","night_stalker_void"],["Toss","tiny_toss"],["Ghostship","kunkka_ghostship"],["Fissure","earthshaker_fissure"],["Echo Slam","earthshaker_echo_slam"],["Meat Hook","pudge_meat_hook"],["Thunder Strike","disruptor_thunder_strike"],["Glimpse","disruptor_glimpse"],["Kinetic Field","disruptor_kinetic_field"],["Static Storm","disruptor_static_storm"],["Bramble Maze","dark_willow_bramble_maze"],["Cursed Crown","dark_willow_cursed_crown"],["Frostbite","crystal_maiden_frostbite"],["Freezing Field","crystal_maiden_freezing_field"],["Earth Spike","lion_impale"],["Chain Frost","lich_chain_frost"],["Frost Shield","lich_frost_shield"],["Shadow Wave","dazzle_shadow_wave"],["Shallow Grave","dazzle_shallow_grave"],["Guardian Angel","omniknight_guardian_angel"],["Living Armor","treant_living_armor"],["Nightmare","bane_nightmare"],["Fiend's Grip","bane_fiends_grip"],["Ice Path","jakiro_ice_path"],["Spell Steal","rubick_spell_steal"],["Leap","mirana_leap"],["Moonlight Shadow","mirana_invis"],["Death Ward","witch_doctor_death_ward"],["Windrun","windrunner_windrun"],["Snowball","tusk_snowball"]];

// ================= ОНЛАЙН-«ШПИОН» (API для мини-аппа) =================
const SPY_CATS = { heroes: 1, items: 1, skills: 1, mix: 1 };
const SPY_MINS = [5, 8, 10];
const spyList = (t) => (t === 'h' ? SPY_HEROES : t === 's' ? SPY_SKILLS : SPY_ITEMS);
const SPY_LANGS = ['ru', 'en', 'de'];
const SPY_MIN = 3;
const SPY_MAX = 12;
const SPY_TTL = 24 * 3600e3;
const spyName = (u) => String([u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || 'Игрок').slice(0, 32);
const CODE_CH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from({ length: 5 }, () => CODE_CH[Math.floor(Math.random() * CODE_CH.length)]).join('');
const isAdminId = (env, id) => String(id) === String(env.ADMIN_ID || '876754050');

// Проверка подписи initData (https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)
async function verifyInitData(raw, token) {
  if (!raw || !token) return null;
  try {
    const params = new URLSearchParams(raw);
    const hash = params.get('hash');
    if (!hash) return null;
    const enc = new TextEncoder();
    const k1 = await crypto.subtle.importKey('raw', enc.encode('WebAppData'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const secret = await crypto.subtle.sign('HMAC', k1, enc.encode(token));
    const k2 = await crypto.subtle.importKey('raw', secret, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const check = async (skip) => {
      const pairs = [];
      for (const [k, v] of params.entries()) if (!skip.includes(k)) pairs.push(`${k}=${v}`);
      pairs.sort();
      const sig = await crypto.subtle.sign('HMAC', k2, enc.encode(pairs.join('\n')));
      return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('') === hash;
    };
    if (!(await check(['hash'])) && !(await check(['hash', 'signature']))) return null;
    const authDate = +params.get('auth_date') || 0;
    if (Date.now() / 1000 - authDate > 86400) return null;
    const user = JSON.parse(params.get('user') || 'null');
    return user && user.id ? { id: user.id, n: spyName(user) } : null;
  } catch (e) {
    return null;
  }
}

let spyTableReady = false;
async function spyDb(env) {
  if (!env.DB) return null;
  if (!spyTableReady) {
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS spyg (code TEXT PRIMARY KEY, ver INTEGER NOT NULL, data TEXT NOT NULL, ts INTEGER NOT NULL)').run();
    spyTableReady = true;
  }
  return env.DB;
}

// Тестовые боты для организатора: сами смотрят роль, задают вопросы и голосуют
const isBot = (g, id) => g.pl.some((p) => p.id === id && p.bot);
function spyStartPlay(g) {
  g.st = 'play';
  g.endAt = Date.now() + (g.min || 8) * 60000;
  g.turnAt = Date.now();
}
function botTick(g) {
  if (!g.pl.some((p) => p.bot)) return false;
  const now = Date.now();
  let ch = false;
  if (g.st === 'roles') {
    g.pl.forEach((p) => { if (p.bot && !g.seen.includes(p.id)) { g.seen.push(p.id); ch = true; } });
    if (g.pl.every((p) => g.seen.includes(p.id))) { spyStartPlay(g); ch = true; }
  } else if (g.st === 'play' && g.turn && g.turn.answering && isBot(g, g.turn.from) && now - (g.turnAt || 0) > 2500) {
    g.turn.answering = false;
    g.turnAt = now;
    ch = true;
  } else if (g.st === 'play' && g.turn && !g.turn.answering && isBot(g, g.turn.from) && now - (g.turnAt || 0) > 3500) {
    const from = g.turn.from;
    const opts = g.pl.filter((p) => p.id !== from && (g.pl.length <= 2 || p.id !== g.turn.prev));
    const t = rnd(opts);
    g.last = { a: from, b: t.id };
    g.turn = { from: t.id, prev: from };
    g.asks = (g.asks || 0) + 1;
    g.turnAt = now;
    ch = true;
  } else if (g.st === 'vote') {
    g.pl.forEach((p) => {
      if (p.bot && !g.votes[p.id]) { g.votes[p.id] = rnd(g.pl.filter((x) => x.id !== p.id)).id; ch = true; }
    });
    if (ch && Object.keys(g.votes).length >= g.pl.length) { spyResolve(g); spyScore(g); }
  }
  return ch;
}

// Изменение игры с проверкой версии: одновременные нажатия не теряются.
async function spyMutate(env, code, fn) {
  const db = await spyDb(env);
  for (let i = 0; i < 8; i++) {
    const row = await db.prepare('SELECT ver, data FROM spyg WHERE code = ?').bind(code).first();
    if (!row) return { err: 'Комната не найдена или уже закрыта' };
    const g = JSON.parse(row.data);
    if (Date.now() - g.ts > SPY_TTL) return { err: 'Комната устарела, создайте новую' };
    const bots = botTick(g);
    const out = fn(g) || {};
    if (out.err) return { err: out.err };
    if (!out.change && !bots) return { g };
    g.ts = Date.now();
    const r = await db.prepare('UPDATE spyg SET data = ?, ver = ver + 1, ts = ? WHERE code = ? AND ver = ?').bind(JSON.stringify(g), g.ts, code, row.ver).run();
    if (r && r.meta && r.meta.changes === 1) return { g };
  }
  return { err: 'Слишком много нажатий сразу, попробуй ещё раз' };
}

async function spyCreate(env, user, cat, lang, bots) {
  const db = await spyDb(env);
  await db.prepare('DELETE FROM spyg WHERE ts < ?').bind(Date.now() - SPY_TTL).run();
  for (let i = 0; i < 10; i++) {
    const g = { code: newCode(), st: 'lobby', host: user, cat: SPY_CATS[cat] ? cat : 'heroes', lang: SPY_LANGS.includes(lang) ? lang : 'ru', pl: [user], round: 0, votes: {}, ts: Date.now() };
    if (bots) g.pl.push({ id: -1, n: 'Бот Вася', bot: true }, { id: -2, n: 'Бот Петя', bot: true }, { id: -3, n: 'Бот Оля', bot: true });
    const r = await db.prepare('INSERT OR IGNORE INTO spyg (code, ver, data, ts) VALUES (?, 1, ?, ?)').bind(g.code, JSON.stringify(g), g.ts).run();
    if (r && r.meta && r.meta.changes === 1) return g;
  }
  throw new Error('code collision');
}

function spyRound(g) {
  const type = g.cat === 'mix' ? rnd(['heroes', 'items', 'skills']) : g.cat;
  const t = type === 'heroes' ? 'h' : type === 'skills' ? 's' : 'i';
  const pick = rnd(spyList(t));
  g.sec = { t, n: pick[0], k: pick[1] };
  g.spy = rnd(g.pl).id;
  g.first = rnd(g.pl).id;
  g.turn = { from: g.first, prev: null };
  g.last = null;
  g.asks = 0;
  g.st = 'roles';
  g.seen = [];
  g.endAt = null;
  g.round = (g.round || 0) + 1;
  g.votes = {};
  g.opts = null;
  g.win = null;
  g.why = '';
}

function spyResolve(g) {
  const counts = {};
  Object.values(g.votes).forEach((t) => (counts[t] = (counts[t] || 0) + 1));
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  g.st = 'over';
  if (!sorted.length) { g.win = 'spy'; g.why = 'Никто не проголосовал.'; return; }
  if (sorted.length > 1 && sorted[0][1] === sorted[1][1]) { g.win = 'spy'; g.why = 'Голоса разделились, никого не выгнали.'; return; }
  const p = g.pl.find((x) => x.id === +sorted[0][0]);
  if (p && p.id === g.spy) { g.win = 'crew'; g.why = `Больше всего голосов получил(а) ${p.n}, и это шпион.`; }
  else { g.win = 'spy'; g.why = `Больше всего голосов получил(а) ${p ? p.n : '?'}, но это мирный игрок.`; }
}
// очки: мирные +1 каждому за пойманного шпиона, шпион +2 за победу
function spyScore(g) {
  if (!g.win || g.scored === g.round) return;
  g.scored = g.round;
  g.pts = g.pts || {};
  if (g.win === 'spy') g.pts[g.spy] = (g.pts[g.spy] || 0) + 2;
  else g.pl.forEach((p) => { if (p.id !== g.spy) g.pts[p.id] = (g.pts[p.id] || 0) + 1; });
}

// То, что видит конкретный игрок. Шпиона и загаданное видят только те, кому положено.
function spyView(g, me) {
  const inGame = g.pl.some((p) => p.id === me.id);
  const live = ['roles', 'play', 'vote', 'guess'].includes(g.st);
  const isSpy = g.spy === me.id;
  const counts = {};
  Object.values(g.votes || {}).forEach((t) => (counts[t] = (counts[t] || 0) + 1));
  const spyP = g.pl.find((p) => p.id === g.spy);
  const firstP = g.pl.find((p) => p.id === g.first);
  const pn = (id) => { const p = g.pl.find((x) => x.id === id); return p ? p.n : '?'; };
  return {
    code: g.code, st: g.st, round: g.round || 0, cat: g.cat, lang: g.lang, min: g.min || 8,
    endAt: live ? g.endAt || null : null, now: Date.now(),
    host: g.host, isHost: g.host.id === me.id, me: me.id, inGame,
    pl: g.pl.map((p) => ({ id: p.id, n: p.n, pts: (g.pts && g.pts[p.id]) || 0, v: g.st === 'vote' ? counts[p.id] || 0 : undefined })),
    role: inGame && (live || g.st === 'over') ? (isSpy ? 'spy' : 'crew') : null,
    sec: (inGame && live && !isSpy) || g.st === 'over' ? g.sec : null,
    first: live && firstP ? firstP.n : null,
    turn: live && g.turn ? { from: g.turn.from, fromN: pn(g.turn.from), prev: g.turn.prev, answering: !!g.turn.answering } : null,
    kicked: (g.banned || []).includes(me.id),
    last: live && g.last ? { a: pn(g.last.a), b: pn(g.last.b) } : null,
    asks: g.asks || 0,
    seen: g.st === 'roles' ? (g.seen || []).includes(me.id) : null,
    waiting: g.st === 'roles' ? g.pl.filter((p) => !(g.seen || []).includes(p.id)).map((p) => p.n) : null,
    bots: g.pl.some((p) => p.bot),
    myVote: g.votes && g.votes[me.id] ? g.votes[me.id] : null,
    voted: Object.keys(g.votes || {}).length,
    opts: g.st === 'guess' ? g.opts : null,
    optT: g.st === 'guess' && g.sec ? g.sec.t : null,
    spyName: (g.st === 'guess' || g.st === 'over') && spyP ? spyP.n : null,
    win: g.win || null, why: g.why || '', stamp: g.ts,
  };
}

async function spyApi(env, me, b) {
  const a = b.a;
  const admin = isAdminId(env, me.id);
  if (a === 'whoami') return { ok: true, v: { admin } };
  if (a === 'create') {
    if (b.bots && !admin) return { ok: false, msg: 'Тест с ботами доступен только организатору' };
    const g = await spyCreate(env, me, b.cat, b.lang, !!b.bots);
    return { ok: true, v: spyView(g, me) };
  }
  const code = String(b.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
  if (!code) return { ok: false, msg: 'Нет кода комнаты' };
  const out = await spyMutate(env, code, (g) => {
    const has = g.pl.some((p) => p.id === me.id);
    const host = g.host.id === me.id;
    switch (a) {
      case 'state':
        return {};
      case 'join':
        if (has) return {};
        if ((g.banned || []).includes(me.id)) return { err: 'Хозяин убрал тебя из этой комнаты. Зайти снова нельзя.' };
        if (g.st !== 'lobby' && g.st !== 'over') return { err: 'Раунд уже идёт. Зайди по ссылке ещё раз, когда он закончится' };
        if (g.pl.length >= SPY_MAX) return { err: `В комнате уже ${SPY_MAX} игроков` };
        g.pl.push(me);
        return { change: true };
      case 'leave':
        if (!has) return {};
        if (g.st !== 'lobby' && g.st !== 'over') return { err: 'Выйти можно между раундами' };
        g.pl = g.pl.filter((p) => p.id !== me.id);
        if (host && g.pl.length) g.host = g.pl[0];
        if (!g.pl.length) g.st = 'closed';
        return { change: true };
      case 'set':
        if (!host) return { err: 'Настройки меняет хозяин комнаты' };
        if (g.st !== 'lobby' && g.st !== 'over') return { err: 'Раунд уже идёт' };
        if (SPY_CATS[b.cat]) g.cat = b.cat;
        if (SPY_LANGS.includes(b.lang)) g.lang = b.lang;
        if (SPY_MINS.includes(+b.min)) g.min = +b.min;
        return { change: true };
      case 'kick': {
        if (!host) return { err: 'Убрать игрока может только хозяин' };
        if (g.st !== 'lobby' && g.st !== 'over') return { err: 'Убирать игроков можно между раундами' };
        const t = g.pl.find((p) => p.id === +b.t);
        if (!t || t.id === me.id) return { err: 'Такого игрока нет' };
        g.pl = g.pl.filter((p) => p.id !== t.id);
        g.banned = [...new Set([...(g.banned || []), t.id])];
        return { change: true };
      }
      case 'start':
        if (!host) return { err: 'Начать может хозяин комнаты' };
        if (g.st !== 'lobby' && g.st !== 'over') return { err: 'Раунд уже идёт' };
        if (g.pl.length < SPY_MIN) return { err: `Нужно минимум ${SPY_MIN} игрока` };
        spyRound(g);
        return { change: true };
      case 'seen':
        if (g.st !== 'roles' || !has) return {};
        if (!g.seen.includes(me.id)) g.seen.push(me.id);
        if (g.pl.every((p) => g.seen.includes(p.id))) spyStartPlay(g);
        return { change: true };
      case 'skip':
        if (!host) return { err: 'Это может только хозяин комнаты' };
        if (g.st !== 'roles') return {};
        spyStartPlay(g);
        return { change: true };
      case 'ask': {
        if (g.st !== 'play') return { err: 'Сейчас не время вопросов' };
        if (!g.turn || g.turn.from !== me.id) return { err: 'Сейчас спрашивает другой игрок' };
        const t = g.pl.find((p) => p.id === +b.t);
        if (!t || t.id === me.id) return { err: 'Выбери другого игрока' };
        if (g.pl.length > 2 && t.id === g.turn.prev) return { err: 'Нельзя спрашивать того, кто только что спросил тебя' };
        g.last = { a: me.id, b: t.id };
        g.turn = { from: t.id, prev: me.id, answering: true };
        g.asks = (g.asks || 0) + 1;
        g.turnAt = Date.now();
        return { change: true };
      }
      case 'done':
        if (g.st !== 'play' || !g.turn || g.turn.from !== me.id || !g.turn.answering) return {};
        g.turn.answering = false;
        g.turnAt = Date.now();
        return { change: true };
      case 'vote_open':
        if (!has) return { err: 'Ты не в этой игре' };
        if (g.st === 'vote') return {};
        if (g.st !== 'play') return { err: 'Сейчас нельзя начать голосование' };
        g.st = 'vote';
        g.votes = {};
        return { change: true };
      case 'vote': {
        if (!has) return { err: 'Голосуют только игроки' };
        if (g.st !== 'vote') return { err: 'Голосование закончилось' };
        const t = g.pl.find((p) => p.id === +b.t);
        if (!t) return { err: 'Такого игрока нет' };
        g.votes[me.id] = t.id;
        if (Object.keys(g.votes).length >= g.pl.length) { spyResolve(g); spyScore(g); }
        return { change: true };
      }
      case 'resolve':
        if (!host) return { err: 'Подвести итог может хозяин комнаты' };
        if (g.st !== 'vote') return { err: 'Голосование не идёт' };
        spyResolve(g);
        spyScore(g);
        return { change: true };
      case 'guess_open':
        if (g.spy !== me.id) return { err: 'Угадывать может только шпион' };
        if (g.st !== 'play' && g.st !== 'vote') return { err: 'Сейчас нельзя' };
        {
          const list = spyList(g.sec.t);
          g.opts = shuffle([[g.sec.n, g.sec.k], ...shuffle(list.filter((x) => x[0] !== g.sec.n)).slice(0, 7)]);
        }
        g.st = 'guess';
        return { change: true };
      case 'guess': {
        if (g.spy !== me.id) return { err: 'Выбирает только шпион' };
        if (g.st !== 'guess') return { err: 'Раунд уже закончился' };
        const pick = g.opts[+b.p];
        if (!pick) return { err: 'Нет такого варианта' };
        g.st = 'over';
        if (pick[0] === g.sec.n) { g.win = 'spy'; g.why = `Шпион угадал: ${pick[0]}.`; }
        else { g.win = 'crew'; g.why = `Шпион ошибся: назвал ${pick[0]}.`; }
        spyScore(g);
        return { change: true };
      }
      case 'end':
        if (!host) return { err: 'Закончить может хозяин комнаты' };
        if (!['roles', 'play', 'vote', 'guess'].includes(g.st)) return {};
        g.st = 'over';
        g.win = null;
        g.why = 'Хозяин комнаты закончил раунд.';
        return { change: true };
    }
    return { err: 'Неизвестное действие' };
  });
  if (out.err) return { ok: false, msg: out.err };
  return { ok: true, v: spyView(out.g, me) };
}

// ================= ТУРНИР НЕДЕЛИ (приз чеком от организатора) =================
// Участие бесплатное. Вопросы и проверка ответов — только на сервере, клиент не знает правильный ответ заранее.
const TOUR_Q = 10;
const TOUR_SEC = 15;
function weekKey(ts) {
  const d = new Date(ts);
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const w = Math.ceil(((t - y0) / 864e5 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(w).padStart(2, '0')}`;
}
function weekEnd(ts) {
  const d = new Date(ts);
  const day = d.getUTCDay() || 7;
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + (8 - day));
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const tourCache = {};
function tourQuestions(week, L) {
  const key = week + '|' + L;
  if (tourCache[key]) return tourCache[key];
  const R = mulberry32(hashStr(key));
  const sh = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const li = L === 'de' ? 1 : 0;
  const qs = [];
  for (const item of sh(QUIZ)) {
    if (qs.length === TOUR_Q) break;
    const reverse = R() < 0.4;
    const label = (x) => (reverse ? x[li] : x[2]);
    const seen = new Set([label(item)]);
    const wrong = [];
    for (const x of sh(QUIZ.filter((x) => x !== item && x[4] === item[4]))) { const l = label(x); if (seen.has(l)) continue; seen.add(l); wrong.push(x); if (wrong.length === 3) break; }
    if (wrong.length < 3) continue;
    const opts = sh([item, ...wrong]);
    qs.push({
      ask: reverse ? `Как сказать ${L === 'de' ? 'по-немецки' : 'по-английски'}?` : 'Что это значит?',
      word: reverse ? item[2] : item[li],
      o: opts.map(label),
      c: opts.indexOf(item),
      a: `${item[li]} — ${item[2]}`,
    });
  }
  return (tourCache[key] = qs);
}
let tourTableReady = false;
async function tourDb(env) {
  if (!env.DB) return null;
  if (!tourTableReady) {
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS tour (week TEXT NOT NULL, lang TEXT NOT NULL, uid INTEGER NOT NULL, name TEXT NOT NULL, qi INTEGER NOT NULL, score INTEGER NOT NULL, ms INTEGER NOT NULL, qts INTEGER NOT NULL, done INTEGER NOT NULL, PRIMARY KEY (week, lang, uid))').run();
    tourTableReady = true;
  }
  return env.DB;
}
async function tourTop(db, week, L, limit) {
  const r = await db.prepare('SELECT uid, name, score, ms FROM tour WHERE week = ? AND lang = ? AND done = 1 ORDER BY score DESC, ms ASC LIMIT ?').bind(week, L, limit || 10).all();
  return (r && r.results) || [];
}
async function tourPlace(db, week, L, row) {
  const r = await db.prepare('SELECT COUNT(*) AS n FROM tour WHERE week = ? AND lang = ? AND done = 1 AND (score > ? OR (score = ? AND ms < ?))').bind(week, L, row.score, row.score, row.ms).first();
  return ((r && r.n) || 0) + 1;
}
// у каждого игрока свой порядок вариантов, чтобы нельзя было подсказать «ответ Б»
function tourPerm(week, L, uid, i) {
  const R = mulberry32(hashStr(`${week}|${L}|${uid}|${i}`));
  const a = [0, 1, 2, 3];
  for (let k = 3; k > 0; k--) { const j = Math.floor(R() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; }
  return a;
}
const tourQ = (q, i, perm) => ({ i, n: TOUR_Q, ask: q.ask, word: q.word, o: perm.map((k) => q.o[k]), sec: TOUR_SEC });

async function tourApi(env, me, b) {
  const db = await tourDb(env);
  const L = b.lang === 'de' ? 'de' : 'en';
  const now = Date.now();
  const week = weekKey(now);
  const qs = tourQuestions(week, L);
  const getRow = () => db.prepare('SELECT * FROM tour WHERE week = ? AND lang = ? AND uid = ?').bind(week, L, me.id).first();
  if (b.a === 'info') {
    const row = await getRow();
    const top = (await tourTop(db, week, L, 10)).map((x) => ({ n: x.name, s: x.score, ms: x.ms, me: x.uid === me.id }));
    const lastTop = (await tourTop(db, weekKey(now - 7 * 864e5), L, 3)).map((x) => ({ n: x.name, s: x.score, ms: x.ms }));
    const mine = row ? { st: row.done ? 'done' : 'play', score: row.score, ms: row.ms, place: row.done ? await tourPlace(db, week, L, row) : null } : { st: 'none' };
    return { ok: true, v: { week, endsAt: weekEnd(now), prize: env.TOUR_PRIZE || '', top, lastTop, mine, n: TOUR_Q, sec: TOUR_SEC } };
  }
  if (b.a === 'start') {
    let row = await getRow();
    if (row && row.done) return { ok: false, msg: 'На этой неделе ты уже сыграл на этом языке' };
    if (!row) {
      await db.prepare('INSERT OR IGNORE INTO tour (week, lang, uid, name, qi, score, ms, qts, done) VALUES (?, ?, ?, ?, 0, 0, 0, ?, 0)').bind(week, L, me.id, me.n, now).run();
      row = await getRow();
    }
    const left = Math.max(0, TOUR_SEC - Math.floor((now - row.qts) / 1000));
    return { ok: true, v: { q: tourQ(qs[row.qi], row.qi, tourPerm(week, L, me.id, row.qi)), left, score: row.score } };
  }
  if (b.a === 'answer') {
    const row = await getRow();
    if (!row) return { ok: false, msg: 'Сначала начни попытку' };
    if (row.done) return { ok: false, msg: 'Попытка уже закончена' };
    if (+b.i !== row.qi) return { ok: false, msg: 'Этот вопрос уже засчитан', resync: true };
    const q = qs[row.qi];
    const spent = now - row.qts;
    const inTime = spent <= TOUR_SEC * 1000 + 1500;
    const perm = tourPerm(week, L, me.id, row.qi);
    const picked = perm[+b.p];
    const right = inTime && picked === q.c;
    const qi = row.qi + 1;
    const done = qi >= TOUR_Q ? 1 : 0;
    const score = row.score + (right ? 1 : 0);
    const ms = row.ms + Math.min(spent, TOUR_SEC * 1000);
    const r = await db.prepare('UPDATE tour SET qi = ?, score = ?, ms = ?, qts = ?, done = ? WHERE week = ? AND lang = ? AND uid = ? AND qi = ?').bind(qi, score, ms, now, done, week, L, me.id, row.qi).run();
    if (!r || !r.meta || r.meta.changes !== 1) return { ok: false, msg: 'Ответ уже засчитан', resync: true };
    const out = { right, c: perm.indexOf(q.c), a: q.a, late: !inTime, score, ms, done: !!done, next: done ? null : tourQ(qs[qi], qi, tourPerm(week, L, me.id, qi)) };
    if (done) out.place = await tourPlace(db, week, L, { score, ms });
    return { ok: true, v: out };
  }
  return { ok: false, msg: 'Неизвестное действие' };
}

async function tourReport(env, chat, from, args) {
  if (!env.DB) return tg(env, 'sendMessage', { chat_id: chat.id, text: 'Турнир ещё не подключён: нужна база D1.' });
  const db = await tourDb(env);
  const isAdmin = isAdminId(env, from.id);
  const L = args.includes('de') ? 'de' : 'en';
  const now = Date.now();
  const week = args.includes('last') ? weekKey(now - 7 * 864e5) : weekKey(now);
  const top = await tourTop(db, week, L, 10);
  const fmtT = (ms) => `${Math.round(ms / 1000)} с`;
  const lines = top.map((x, i) => `${i + 1}. ${x.name} — ${x.score}/${TOUR_Q}, ${fmtT(x.ms)}${isAdmin ? `  (id ${x.uid})` : ''}`);
  const text = `🏆 Турнир недели ${week} ${L === 'de' ? '🇩🇪' : '🇬🇧'}\n${env.TOUR_PRIZE ? 'Приз: ' + env.TOUR_PRIZE + '\n' : ''}\n${lines.join('\n') || 'Пока никто не сыграл.'}` +
    (isAdmin ? `\n\nОтправить приз: /prize МЕСТО ССЫЛКА_НА_ЧЕК${L === 'de' ? ' de' : ''}${args.includes('last') ? ' last' : ''}` : '');
  return tg(env, 'sendMessage', { chat_id: chat.id, text, reply_markup: { inline_keyboard: [[{ text: '🏆 Играть в турнир', url: `${appLink(env)}?startapp=tour` }]] } });
}

async function tourPrize(env, chat, from, args) {
  if (!isAdminId(env, from.id)) return tg(env, 'sendMessage', { chat_id: chat.id, text: 'Эта команда только для организатора турнира.' });
  const place = parseInt(args[0], 10);
  const link = args.find((a) => /^https?:\/\//.test(a));
  if (!place || !link) return tg(env, 'sendMessage', { chat_id: chat.id, text: 'Формат: /prize МЕСТО ССЫЛКА_НА_ЧЕК\nНапример: /prize 1 https://t.me/send?start=CQ... \nДобавь de для немецкой таблицы и last для прошлой недели.' });
  const db = await tourDb(env);
  const L = args.includes('de') ? 'de' : 'en';
  const week = args.includes('last') ? weekKey(Date.now() - 7 * 864e5) : weekKey(Date.now());
  const top = await tourTop(db, week, L, place);
  const w = top[place - 1];
  if (!w) return tg(env, 'sendMessage', { chat_id: chat.id, text: `На ${place} месте никого нет.` });
  const r = await tg(env, 'sendMessage', { chat_id: w.uid, text: `🏆 Ты занял ${place} место в турнире недели (${week})!\n\nТвой приз: ${link}\n\nЖми на ссылку, чтобы забрать чек в @CryptoBot.` });
  return tg(env, 'sendMessage', { chat_id: chat.id, text: r && r.ok ? `Приз отправлен: ${w.name} (${place} место).` : `Не получилось написать ${w.name}: он ещё не запускал бота. Попроси его нажать /start и отправь ещё раз.` });
}

/* ================= админ-панель: какие разделы видят игроки ================= */
// Хранится одним документом в D1. Менять может только ADMIN_ID (проверяется здесь, на сервере).
// Состояния: on — открыт; maint — «Технические работы»; dev — «В разработке»; hide — скрыт. allow — ID, кому открыт всегда.
let flagsReady = false;
async function flagsDb(env) {
  if (!env.DB) return null;
  if (!flagsReady) {
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS appflags (k TEXT PRIMARY KEY, v TEXT NOT NULL, ts INTEGER NOT NULL)').run();
    flagsReady = true;
  }
  return env.DB;
}
async function flagsLoad(env) {
  const db = await flagsDb(env);
  if (!db) return {};
  const r = await db.prepare("SELECT v FROM appflags WHERE k = 'sections'").first();
  try { return r ? JSON.parse(r.v) : {}; } catch (e) { return {}; }
}
function flagsFor(all, uid, admin) {
  const out = {};
  for (const k in all) {
    const f = all[k] || {};
    const st = f.st || 'on';
    out[k] = admin || st === 'on' || (f.allow || []).map(String).includes(String(uid)) ? 'on' : st;
  }
  return out;
}
// замки из админ-панели действуют и в боте: закрытый раздел не запустить ни командой, ни кнопкой из меню
const GATE_TXT = { maint: '🛠 сейчас на технических работах. Загляни чуть позже.', dev: '🚧 ещё в разработке. Скоро откроем.' };
async function botGate(env, chat, uid, keys, title) {
  try {
    const st = flagsFor(await flagsLoad(env), uid, isAdminId(env, uid));
    for (const k of keys) if (st[k] && st[k] !== 'on') {
      await tg(env, 'sendMessage', { chat_id: chat.id, text: st[k] === 'hide' ? 'Такой команды нет. Всё внутри приложения 👇' : `${title} ${GATE_TXT[st[k]] || GATE_TXT.maint}` });
      return true;
    }
  } catch (e) {}
  return false;
}
async function flagsApi(env, user, b) {
  const admin = isAdminId(env, user.id);
  if (b.a === 'set') {
    if (!admin) return { ok: false, msg: 'Менять разделы может только организатор' };
    const clean = {};
    for (const [k, f] of Object.entries(b.flags || {})) {
      if (!/^[a-z0-9:_-]{1,48}$/.test(k) || !f) continue;
      const st = ['on', 'maint', 'dev', 'hide'].includes(f.st) ? f.st : 'on';
      const allow = [...new Set((Array.isArray(f.allow) ? f.allow : []).map((x) => String(x).replace(/\D/g, '')).filter(Boolean))].slice(0, 100);
      if (st === 'on' && !allow.length) continue;
      clean[k] = { st, allow };
    }
    const db = await flagsDb(env);
    await db.prepare("INSERT INTO appflags (k, v, ts) VALUES ('sections', ?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v, ts = excluded.ts")
      .bind(JSON.stringify(clean), Date.now()).run();
    return { ok: true, v: { admin, me: user.id, flags: flagsFor(clean, user.id, admin), raw: clean } };
  }
  const all = await flagsLoad(env);
  return { ok: true, v: { admin, me: user.id, flags: flagsFor(all, user.id, admin), raw: admin ? all : undefined } };
}

/* ================= карточная дуэль онлайн: комнаты по коду ================= */
// Сервер хранит состояние партии целиком. Писать может только тот, чей сейчас ход (и только поверх той версии, которую видел).
let cgReady = false;
async function cgDb(env) {
  if (!env.DB) return null;
  if (!cgReady) {
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS cgroom (code TEXT PRIMARY KEY, host TEXT, hname TEXT, hhero TEXT, guest TEXT, gname TEXT, st TEXT, state TEXT, ver INTEGER, turn TEXT, left TEXT, ts INTEGER)').run();
    cgReady = true;
  }
  return env.DB;
}
function cgView(r, uid) {
  if (!r) return null;
  const me = String(uid) === r.host ? 'host' : String(uid) === r.guest ? 'guest' : null;
  return { code: r.code, st: r.st, me, host: { n: r.hname, hero: r.hhero }, guest: r.guest ? { n: r.gname, hero: r.hhero === 'bateman' ? 'durden' : 'bateman' } : null,
    ver: r.ver, turn: r.turn, left: r.left || null, state: me ? r.state : null };
}
async function cgApi(env, user, b) {
  const db = await cgDb(env);
  if (!db) return { ok: false, msg: 'Онлайн пока не подключён (нужна база D1)' };
  const uid = String(user.id), name = String(user.n || 'Игрок').slice(0, 40);
  const now = Date.now();
  const get = (code) => db.prepare('SELECT * FROM cgroom WHERE code = ?').bind(String(code || '').toUpperCase()).first();
  if (b.a === 'create') {
    await db.prepare('DELETE FROM cgroom WHERE ts < ?').bind(now - 864e5).run();
    const hero = b.hero === 'durden' ? 'durden' : 'bateman';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code = newCode();
      if (!(await get(code))) break;
    }
    await db.prepare('INSERT INTO cgroom (code, host, hname, hhero, st, ver, ts) VALUES (?, ?, ?, ?, ?, 0, ?)').bind(code, uid, name, hero, 'wait', now).run();
    return { ok: true, v: cgView(await get(code), uid) };
  }
  const r = await get(b.code);
  if (!r) return { ok: false, msg: 'Комната не найдена. Проверь код.' };
  if (b.a === 'join') {
    if (r.host === uid || r.guest === uid) return { ok: true, v: cgView(r, uid) };
    if (r.st !== 'wait') return { ok: false, msg: 'В этой комнате уже играют' };
    await db.prepare("UPDATE cgroom SET guest = ?, gname = ?, st = 'play', ts = ? WHERE code = ? AND st = 'wait'").bind(uid, name, now, r.code).run();
    return { ok: true, v: cgView(await get(r.code), uid) };
  }
  if (b.a === 'state') return { ok: true, v: cgView(r, uid) };
  const me = uid === r.host ? 'host' : uid === r.guest ? 'guest' : null;
  if (!me) return { ok: false, msg: 'Ты не в этой комнате' };
  if (b.a === 'push') {
    if (r.st !== 'play') return { ok: false, msg: 'Партия не идёт' };
    const first = r.ver === 0 && me === 'host';
    if (!first && r.turn !== me) return { ok: false, err: 'turn', msg: 'Сейчас не твой ход' };
    if (Number(b.ver) !== r.ver) return { ok: false, err: 'ver', v: cgView(r, uid) };
    const state = String(b.state || '');
    if (state.length > 60000) return { ok: false, msg: 'Слишком большое состояние' };
    const turn = b.turn === 'guest' ? 'guest' : 'host', st = b.over ? 'over' : 'play';
    const res = await db.prepare('UPDATE cgroom SET state = ?, ver = ver + 1, turn = ?, st = ?, ts = ? WHERE code = ? AND ver = ?').bind(state, turn, st, now, r.code, r.ver).run();
    if (!res.meta || !res.meta.changes) return { ok: false, err: 'ver', v: cgView(await get(r.code), uid) };
    return { ok: true, v: cgView(await get(r.code), uid) };
  }
  if (b.a === 'leave') {
    await db.prepare("UPDATE cgroom SET st = 'over', left = ?, ts = ? WHERE code = ?").bind(me, now, r.code).run();
    return { ok: true };
  }
  return { ok: false, msg: 'Неизвестное действие' };
}

/* ================= 12.0: дуэль по сцене (наперегонки / вместе) + сброс прогресса игроку ================= */
// Раньше это был отдельный воркер kino-pvp. Теперь здесь: POST /api/pvp, игрок — из проверенной подписи Telegram.
// Комната — JSON в pvp_rooms с версией (ver), чтобы одновременные ответы двух игроков не терялись.
// Сброс: админ кладёт метку времени в kino_reset, приложение игрока при запуске спрашивает её и, если она новее, обнуляет прогресс.
let pvpReady = false;
async function pvpDb(env) {
  if (!env.DB) return null;
  if (!pvpReady) {
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS pvp_rooms (code TEXT PRIMARY KEY, data TEXT NOT NULL, ver INTEGER NOT NULL, upd INTEGER NOT NULL)').run();
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS kino_reset (uid TEXT PRIMARY KEY, t INTEGER NOT NULL)').run();
    pvpReady = true;
  }
  return env.DB;
}
async function pvpLoad(db, code) {
  const r = await db.prepare('SELECT data, ver FROM pvp_rooms WHERE code = ?').bind(code).first();
  return r ? { room: JSON.parse(r.data), ver: r.ver } : null;
}
async function pvpMutate(db, code, fn) {
  for (let i = 0; i < 8; i++) {
    const cur = await pvpLoad(db, code);
    if (!cur) return { err: 'Комната не найдена — возможно, она устарела' };
    const res = fn(cur.room);
    if (res && res.err) return res;
    cur.room.ver = cur.ver + 1;
    cur.room.upd = Date.now();
    const r = await db.prepare('UPDATE pvp_rooms SET data = ?, ver = ?, upd = ? WHERE code = ? AND ver = ?').bind(JSON.stringify(cur.room), cur.ver + 1, Date.now(), code, cur.ver).run();
    if (r && r.meta && r.meta.changes) return { room: cur.room };
  }
  return { err: 'Сервер занят, попробуй ещё раз' };
}
const pvpRole = (room, uid) => (room.A && room.A.id === uid ? 'A' : room.B && room.B.id === uid ? 'B' : null);
async function pvpApi(env, user, b) {
  const db = await pvpDb(env);
  const uid = 'tg' + user.id, name = String(user.n || 'Игрок').slice(0, 20), now = Date.now();
  const fx = /^[A-Za-z0-9-]{1,16}$/.test(String(b.fx || '')) ? String(b.fx) : '';   // 13.3: стиль «кражи билетов» — друг увидит его при проигрыше
  if (b.a === 'rget') {
    const r = await db.prepare('SELECT t FROM kino_reset WHERE uid = ?').bind(uid).first();
    return { ok: true, v: { t: r ? r.t : 0 } };
  }
  if (b.a === 'rset') {
    if (!isAdminId(env, user.id)) return { ok: false, msg: 'Только для админа' };
    const t = String(b.target || '');
    if (!/^tg\d{3,15}$/.test(t)) return { ok: false, msg: 'Неверный ID' };
    await db.prepare('INSERT INTO kino_reset (uid, t) VALUES (?, ?) ON CONFLICT(uid) DO UPDATE SET t = excluded.t').bind(t, now).run();
    return { ok: true, v: { t: now } };
  }
  if (b.a === 'create') {
    const R = b.room || {};
    if (!R.sid || !Array.isArray(R.qs) || !R.qs.length || R.qs.length > 12) return { ok: false, msg: 'bad room' };
    await db.prepare('DELETE FROM pvp_rooms WHERE upd < ?').bind(now - 36 * 3600e3).run();
    const room = { sid: String(R.sid).slice(0, 60), ep: R.ep | 0, mode: R.mode === 'coop' ? 'coop' : 'race', bet: Math.max(0, Math.min(1000, R.bet | 0)), qs: R.qs,
      A: { id: uid, n: name, fx, ans: {}, done: false }, B: null, st: 'wait', go: 0, turn: 0, co: {}, help: -1, created: now };
    for (let i = 0; i < 5; i++) {
      const c = newCode();
      room.code = c; room.ver = 1; room.upd = now;
      const r = await db.prepare('INSERT OR IGNORE INTO pvp_rooms (code, data, ver, upd) VALUES (?, ?, 1, ?)').bind(c, JSON.stringify(room), now).run();
      if (r && r.meta && r.meta.changes) return { ok: true, v: room };
    }
    return { ok: false, msg: 'Не получилось создать комнату' };
  }
  const code = String(b.code || '').toUpperCase().slice(0, 8);
  if (!/^[A-Z0-9]{5}$/.test(code)) return { ok: false, msg: 'Неверный код комнаты' };
  if (b.a === 'state') {
    const cur = await pvpLoad(db, code);
    return cur ? { ok: true, v: cur.room } : { ok: false, msg: 'Комната не найдена — возможно, она устарела' };
  }
  let out;
  if (b.a === 'join') out = await pvpMutate(db, code, (room) => {
    if (pvpRole(room, uid)) return;
    if (room.B) return { err: 'В комнате уже двое' };
    room.B = { id: uid, n: name, fx, ans: {}, done: false }; room.st = 'go'; room.go = Date.now() + 3500;
  });
  else if (b.a === 'ans') out = await pvpMutate(db, code, (room) => {
    const me = pvpRole(room, uid);
    if (!me) return { err: 'Ты не в этой комнате' };
    const k = b.k | 0;
    if (k < 0 || k >= room.qs.length) return { err: 'bad k' };
    const a = { ok: !!b.ok, ms: Math.max(0, Math.min(600000, b.ms | 0)), by: me };
    if (room.mode === 'race') {
      if (room[me].ans[k]) return;
      room[me].ans[k] = a;
      if (Object.keys(room[me].ans).length >= room.qs.length) room[me].done = true;
    } else {
      if (room.co[k] || k !== room.turn) return;
      const mine = (k % 2 === 0 ? 'A' : 'B') === me;
      if (!mine && room.help !== k) return { err: 'Сейчас ход друга' };
      room.co[k] = a; room.turn = k + 1; room.help = -1;
      if (room.turn >= room.qs.length) { room.A.done = true; if (room.B) room.B.done = true; }
    }
    if (room.A.done && room.B && room.B.done) room.st = 'end';
  });
  else if (b.a === 'help') out = await pvpMutate(db, code, (room) => {
    if (!pvpRole(room, uid)) return { err: 'Ты не в этой комнате' };
    if (room.mode === 'coop' && (b.k | 0) === room.turn) room.help = b.k | 0;
  });
  else if (b.a === 'leave') out = await pvpMutate(db, code, (room) => {
    const me = pvpRole(room, uid);
    if (!me) return;
    room[me].left = true;
    if (room.st !== 'end') room.st = room.B ? 'left' : 'closed';
  });
  else return { ok: false, msg: 'Неизвестное действие' };
  return out.err ? { ok: false, msg: out.err } : { ok: true, v: out.room };
}

/* ================= дуэль прямо в чате: 10 вопросов-викторин по 20 секунд ================= */
// Telegram сам закрывает опрос по таймеру и присылает боту апдейт — тогда уходит следующий вопрос.
// Ответы приходят как poll_answer (опросы не анонимные), бот считает очки.
const CD_Q = 10, CD_SEC = 20;
let cdReady = false;
async function cdDb(env) {
  if (!env.DB) return null;
  if (!cdReady) {
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS chatduel (chat TEXT PRIMARY KEY, lang TEXT, i INTEGER, poll TEXT, correct INTEGER, scores TEXT, names TEXT, ts INTEGER)').run();
    cdReady = true;
  }
  return env.DB;
}
async function cdSend(env, chat, d) {
  const q = makeQuiz(d.lang);
  const r = await tg(env, 'sendPoll', {
    chat_id: chat, question: cut(`Вопрос ${d.i + 1} из ${CD_Q}\n${q.question}`, 300), options: q.options.map((text) => ({ text })), type: 'quiz',
    correct_option_id: q.correct, explanation: q.explanation, is_anonymous: false, open_period: CD_SEC,
  });
  const pid = r && r.result && r.result.poll ? r.result.poll.id : '';
  await env.DB.prepare('UPDATE chatduel SET i = ?, poll = ?, correct = ?, ts = ? WHERE chat = ?').bind(d.i, pid, q.correct, Date.now(), String(chat)).run();
}
async function chatDuelStart(env, chat, lang) {
  const db = await cdDb(env);
  if (!db) return tg(env, 'sendMessage', { chat_id: chat.id, text: 'Дуэль в чате пока не подключена (нужна база D1).' });
  const L = LANG[lang] ? lang : 'en';
  const cur = await db.prepare('SELECT * FROM chatduel WHERE chat = ?').bind(String(chat.id)).first();
  if (cur && Date.now() - cur.ts < (CD_SEC + 40) * 1000) return tg(env, 'sendMessage', { chat_id: chat.id, text: 'Дуэль уже идёт — отвечай на вопрос выше.' });
  await db.prepare('INSERT OR REPLACE INTO chatduel (chat, lang, i, poll, correct, scores, names, ts) VALUES (?, ?, 0, ?, 0, ?, ?, ?)').bind(String(chat.id), L, '', '{}', '{}', Date.now()).run();
  await tg(env, 'sendMessage', { chat_id: chat.id, text: `Дуэль в чате · ${L === 'de' ? 'немецкий' : 'английский'}\n\n${CD_Q} вопросов по ${CD_SEC} секунд. Отвечай прямо в опросе — очки считаются сами. В конце — таблица.` });
  await cdSend(env, chat.id, { lang: L, i: 0 });
}
async function chatDuelAnswer(env, pa) {
  const db = await cdDb(env);
  if (!db || !pa || !pa.user) return;
  const d = await db.prepare('SELECT * FROM chatduel WHERE poll = ?').bind(String(pa.poll_id)).first();
  if (!d) return;
  const scores = JSON.parse(d.scores || '{}'), names = JSON.parse(d.names || '{}');
  const uid = String(pa.user.id);
  names[uid] = [pa.user.first_name, pa.user.last_name].filter(Boolean).join(' ').slice(0, 32) || 'Игрок';
  scores[uid] = (scores[uid] || 0) + ((pa.option_ids || [])[0] === d.correct ? 1 : 0);
  await db.prepare('UPDATE chatduel SET scores = ?, names = ? WHERE chat = ? AND poll = ?').bind(JSON.stringify(scores), JSON.stringify(names), d.chat, d.poll).run();
}
async function chatDuelClosed(env, poll) {
  const db = await cdDb(env);
  if (!db || !poll || !poll.is_closed) return;
  const d = await db.prepare('SELECT * FROM chatduel WHERE poll = ?').bind(String(poll.id)).first();
  if (!d) return;
  // защита от двойного апдейта: двигаем дуэль только с этого опроса
  const moved = await db.prepare("UPDATE chatduel SET poll = 'moving' WHERE chat = ? AND poll = ?").bind(d.chat, d.poll).run();
  if (!moved.meta || !moved.meta.changes) return;
  if (d.i + 1 < CD_Q) return cdSend(env, d.chat, { lang: d.lang, i: d.i + 1 });
  const scores = JSON.parse(d.scores || '{}'), names = JSON.parse(d.names || '{}');
  const rows = Object.keys(names).map((u) => ({ n: names[u], s: scores[u] || 0 })).sort((a, b) => b.s - a.s);
  const medal = ['🥇', '🥈', '🥉'];
  const table = rows.length ? rows.map((r, i) => `${medal[i] || '   '} ${r.n} — ${r.s} из ${CD_Q}`).join('\n') : 'Никто не ответил 🤷';
  await db.prepare('DELETE FROM chatduel WHERE chat = ?').bind(d.chat).run();
  return tg(env, 'sendMessage', { chat_id: d.chat, text: `Итоги дуэли\n\n${table}${rows[0] && rows[0].s ? `\n\nПобеда: ${rows[0].n}` : ''}`,
    reply_markup: { inline_keyboard: [[{ text: '⚔️ Реванш', callback_data: 'cduel:' + d.lang }], [{ text: '▶️ Учить слова в приложении', url: appLink(env) }]] } });
}

const LANG = { en: { flag: '🇬🇧', name: 'по-английски', idx: 0 }, de: { flag: '🇩🇪', name: 'по-немецки', idx: 1 } };
const rnd = (a) => a[Math.floor(Math.random() * a.length)];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const cut = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const appLink = (env) => env.APP_LINK || 'https://t.me/languagegamesbot/languagedota2';

function makeQuiz(lang) {
  const L = LANG[lang] ? lang : Math.random() < 0.5 ? 'en' : 'de';
  const li = LANG[L].idx;
  const item = rnd(QUIZ);
  const same = QUIZ.filter((x) => x !== item && x[4] === item[4]);
  const reverse = Math.random() < 0.4;
  const label = (x) => (reverse ? x[li] : x[2]);
  const seen = new Set([label(item)]);
  const wrong = [];
  for (const x of shuffle(same)) { const l = label(x); if (seen.has(l)) continue; seen.add(l); wrong.push(x); if (wrong.length === 3) break; }
  const opts = shuffle([item, ...wrong]);
  const question = reverse ? `${LANG[L].flag} Как сказать ${LANG[L].name}: «${item[2]}»?` : `${LANG[L].flag} Что значит «${item[li]}»?`;
  const explanation = cut(`${item[li]} — ${item[2]}.${item[3] ? ' ' + item[3] : ''}`, 200);
  return { L, question: cut(question, 300), options: opts.map((x) => cut(label(x), 100)), correct: opts.indexOf(item), explanation };
}

function wordOfDay() {
  const pool = QUIZ.filter((x) => x[4] !== 'p');
  const day = Math.floor(Date.now() / 864e5);
  const x = pool[(day * 7919) % pool.length];
  return `Слово дня\n\n🇬🇧 ${x[0]}\n🇩🇪 ${x[1]}\n🇷🇺 ${x[2]}${x[3] ? '\n\n' + x[3] : ''}`;
}

// кнопка мини-аппа: в личке — web_app, в группах web_app нельзя, там ссылка
const openBtn = (env, isGroup, text, p) => isGroup
  ? { text, url: appLink(env) + '?' + (p ? 'startapp=' + p + '&' : '') + 'mode=fullscreen' }
  : { text, web_app: { url: env.APP_URL + (p ? '?startapp=' + p : '') } };

// главное меню: одна большая кнопка и ряд из двух
function menu(env, isGroup) {
  return {
    inline_keyboard: [
      [openBtn(env, isGroup, '▶️  Открыть приложение', '')],
      [openBtn(env, isGroup, '🎬 Кинозал', 'kino'), { text: '👥 С друзьями', callback_data: 'friends' }],
    ],
  };
}
// под короткими ответами — только одна кнопка
const oneBtn = (env, isGroup) => ({ inline_keyboard: [[openBtn(env, isGroup, '▶️  Открыть приложение', '')]] });

function friendsMenu(env, isGroup, st) {
  const on = (k) => !st || ((st.games || 'on') !== 'hide' && (st[k] || 'on') !== 'hide');
  const row2 = [on('spy') && { text: '🕵️ «Шпион»', callback_data: 'spy' }, on('arena') && { text: '⚔️ Дуэль в чате', callback_data: 'duel' }].filter(Boolean);
  return { inline_keyboard: [on('cards') && [openBtn(env, isGroup, '🃏 Карточная дуэль', 'cards')], row2.length && row2].filter(Boolean) };
}
// текст меню «С друзьями» без скрытых игр
function friendsText(st) {
  const on = (k) => !st || ((st.games || 'on') !== 'hide' && (st[k] || 'on') !== 'hide');
  const L = [on('cards') && '🃏 <b>Карточная дуэль</b> — онлайн, комната по ссылке', on('spy') && '🕵️ <b>«Шпион»</b> — 3–12 человек, общаетесь в чате', on('arena') && '⚔️ <b>Дуэль в чате</b> — 10 вопросов на время, в конце таблица'].filter(Boolean);
  return L.length ? `<b>Играть с друзьями</b>\n\n${L.join('\n')}\n\nЛучше всего — в группе с друзьями: добавь туда бота.` : 'Скоро здесь появятся игры с друзьями 👀';
}

async function sendWelcome(env, chat, name, isGroup) {
  const photo = env.WELCOME_IMG || String(env.APP_URL || '').replace(/\/?$/, '/') + 'img/welcome.jpg';
  const r = await tg(env, 'sendPhoto', { chat_id: chat.id, photo, caption: WELCOME(name), parse_mode: 'HTML', reply_markup: menu(env, isGroup) });
  if (r && r.ok) return r;
  // картинка не нашлась — то же самое текстом
  return tg(env, 'sendMessage', { chat_id: chat.id, text: WELCOME(name), parse_mode: 'HTML', reply_markup: menu(env, isGroup) });
}

async function tg(env, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function sendQuiz(env, chat, lang) {
  const q = makeQuiz(lang);
  const isGroup = chat.type === 'group' || chat.type === 'supergroup';
  return tg(env, 'sendPoll', {
    chat_id: chat.id, question: q.question, options: q.options.map((text) => ({ text })), type: 'quiz',
    correct_option_id: q.correct, explanation: q.explanation, is_anonymous: !isGroup,
    reply_markup: { inline_keyboard: [[{ text: 'Ещё вопрос', callback_data: 'quiz:' + q.L }]] },
  });
}

async function sendSpyRoom(env, chat, from, args) {
  if (!env.DB) return tg(env, 'sendMessage', { chat_id: chat.id, text: 'Онлайн-«Шпион» ещё не подключён: владельцу бота нужно подключить базу D1. Пока можно играть за одним телефоном прямо в игре.' });
  const cat = (args || []).find((a) => SPY_CATS[a]) || 'heroes';
  const lang = (args || []).find((a) => SPY_LANGS.includes(a)) || 'ru';
  const g = await spyCreate(env, { id: from.id, n: spyName(from) }, cat, lang);
  const link = `${appLink(env)}?startapp=spy_${g.code}`;
  const text = `🕵️ Шпион: комната ${g.code}\n\nЗаходите по кнопке. Все, кроме шпиона, увидят загаданного ${cat === 'items' ? 'предмет' : cat === 'mix' ? 'героя или предмет' : 'героя'}. Общайтесь здесь в чате или голосом, голосование — в игре.\n\nНужно от 3 до 12 игроков. Начинает ${spyName(from)}.`;
  return tg(env, 'sendMessage', { chat_id: chat.id, text, reply_markup: { inline_keyboard: [[{ text: '🕵️ Войти в комнату', url: link }]] } });
}

async function onUpdate(upd, env) {
  if (upd.poll_answer) return chatDuelAnswer(env, upd.poll_answer);
  if (upd.poll) return chatDuelClosed(env, upd.poll);
  const me = (env.BOT_USERNAME || 'languagegamesbot').toLowerCase();
  const msg = upd.message;
  if (msg && msg.chat && msg.text) {
    const chat = msg.chat;
    const isGroup = chat.type === 'group' || chat.type === 'supergroup';
    const parts = msg.text.trim().split(/\s+/);
    const [cmdRaw, target] = parts[0].toLowerCase().split('@');
    if (target && target !== me) return;
    const args = parts.slice(1).map((x) => x.toLowerCase());
    const name = (msg.from && msg.from.first_name) || '';
    if (!isGroup && msg.from) { await statsTouch(env, msg.from, cmdRaw === '/start' ? parts[1] : ''); if (cmdRaw === '/start') await statsEvent(env, msg.from, 'bot_start', parts[1] || ''); }
    if (cmdRaw === '/stats') { if (!isAdminId(env, msg.from.id)) return; return tg(env, 'sendMessage', { chat_id: chat.id, text: await statsReport(env), parse_mode: 'HTML', disable_web_page_preview: true }); }
    if (cmdRaw === '/quiz') return sendQuiz(env, chat, args[0]);
    if (cmdRaw === '/duel') return (await botGate(env, chat, msg.from.id, ['games', 'arena'], '⚔️ Дуэль')) || chatDuelStart(env, chat, args[0]);
    if (cmdRaw === '/spy') return (await botGate(env, chat, msg.from.id, ['games', 'spy'], '🕵️ «Шпион»')) || sendSpyRoom(env, chat, msg.from, args);
    if (cmdRaw === '/tour') return (await botGate(env, chat, msg.from.id, ['games', 'arena'], '🏆 Турнир')) || tourReport(env, chat, msg.from, args);
    if (cmdRaw === '/prize') return tourPrize(env, chat, msg.from, parts.slice(1));
    if (cmdRaw === '/myid') return tg(env, 'sendMessage', { chat_id: chat.id, text: `Твой Telegram ID: ${msg.from.id}` });
    if (cmdRaw === '/word') return tg(env, 'sendMessage', { chat_id: chat.id, text: wordOfDay(), reply_markup: oneBtn(env, isGroup) });
    if (cmdRaw === '/help') return tg(env, 'sendMessage', { chat_id: chat.id, text: HELP, reply_markup: oneBtn(env, isGroup) });
    if (cmdRaw === '/cards') return tg(env, 'sendMessage', { chat_id: chat.id, text: '🃏 Карточная дуэль: Бейтман против Дёрдена. Играй с компьютером или создай комнату и позови друга по ссылке.', reply_markup: { inline_keyboard: [[isGroup ? { text: '🃏 Играть', url: appLink(env) + '?startapp=cards' } : { text: '🃏 Играть', web_app: { url: env.APP_URL + '?startapp=cards' } }]] } });
    if (cmdRaw === '/start') return sendWelcome(env, chat, isGroup ? '' : name, isGroup);
    if (!isGroup) return tg(env, 'sendMessage', { chat_id: chat.id, text: 'Всё внутри приложения 👇', reply_markup: oneBtn(env, false) });
    return;
  }
  const cq = upd.callback_query;
  if (cq) {
    await tg(env, 'answerCallbackQuery', { callback_query_id: cq.id });
    if (!cq.message) return;
    const chat = cq.message.chat;
    const isGroup = chat.type === 'group' || chat.type === 'supergroup';
    const data = cq.data || '';
    if (data.startsWith('quiz')) return sendQuiz(env, chat, data.split(':')[1]);
    if (data === 'duel') return (await botGate(env, chat, cq.from.id, ['games', 'arena'], '⚔️ Дуэль')) || chatDuelStart(env, chat, 'en');
    if (data.startsWith('cduel:')) return (await botGate(env, chat, cq.from.id, ['games', 'arena'], '⚔️ Дуэль')) || chatDuelStart(env, chat, data.slice(6));
    if (data === 'spy') return (await botGate(env, chat, cq.from.id, ['games', 'spy'], '🕵️ «Шпион»')) || sendSpyRoom(env, chat, cq.from, []);
    if (data === 'word') return tg(env, 'sendMessage', { chat_id: chat.id, text: wordOfDay(), reply_markup: oneBtn(env, isGroup) });
    if (data === 'friends') { let st = null; try { st = flagsFor(await flagsLoad(env), cq.from.id, isAdminId(env, cq.from.id)); } catch (e) {} return tg(env, 'sendMessage', { chat_id: chat.id, text: friendsText(st), parse_mode: 'HTML', reply_markup: friendsMenu(env, isGroup, st) }); }
    if (data === 'help') return tg(env, 'sendMessage', { chat_id: chat.id, text: HELP, reply_markup: oneBtn(env, isGroup) });
  }
}

/* ================= напоминания о повторении ================= */
// Приложение присылает: когда ближайшие фразы пора повторить (next, мс) и сколько их (n), или off.
// Cron (Cloudflare → Triggers → Cron, например «0 * * * *») раз в час рассылает напоминания днём по Берлину.
let remindReady = false;
async function remindDb(env) {
  if (!env.DB) return null;
  if (!remindReady) { await env.DB.prepare('CREATE TABLE IF NOT EXISTS reminders (uid INTEGER PRIMARY KEY, next INTEGER, n INTEGER, off INTEGER, sent INTEGER)').run(); try { await env.DB.prepare('ALTER TABLE reminders ADD COLUMN top TEXT').run(); } catch (e) {} remindReady = true; }
  return env.DB;
}
async function remindApi(env, user, b) {
  const db = await remindDb(env);
  const next = Math.max(0, Math.floor(+b.next || 0)), n = Math.max(0, Math.min(999, Math.floor(+b.n || 0))), off = b.off ? 1 : 0;
  const top = JSON.stringify((Array.isArray(b.top) ? b.top : []).slice(0, 3).map((x) => String(x).slice(0, 90)));
  await db.prepare('INSERT INTO reminders (uid, next, n, off, sent, top) VALUES (?, ?, ?, ?, 0, ?) ON CONFLICT(uid) DO UPDATE SET next = excluded.next, n = excluded.n, off = excluded.off, top = excluded.top').bind(user.id, next, n, off, top).run();
  return { ok: true };
}
async function remindTick(env) {
  const db = await remindDb(env);
  if (!db) return;
  const hour = +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: 'numeric', hour12: false }).format(new Date());
  if (hour < 10 || hour >= 21) return;
  const now = Date.now();
  const rows = (await db.prepare('SELECT uid, n, top FROM reminders WHERE off = 0 AND next > 0 AND next <= ? AND n > 0 AND (sent IS NULL OR sent < next) AND (sent IS NULL OR sent < ?) LIMIT 200').bind(now, now - 20 * 36e5).all()).results || [];
  for (const r of rows) {
    const res = await tg(env, 'sendMessage', { chat_id: r.uid, text: `🎬 Пора повторить: ${r.n} ${r.n % 10 === 1 && r.n % 100 !== 11 ? 'фраза' : r.n % 10 >= 2 && r.n % 10 <= 4 && (r.n % 100 < 12 || r.n % 100 > 14) ? 'фразы' : 'фраз'} из сцен.${(() => { try { const L = JSON.parse(r.top || '[]'); return L.length ? '\n\n' + L.map((x) => '• ' + x).join('\n') : ''; } catch (e) { return ''; } })()}\n\nПара минут — и они останутся надолго.`, reply_markup: { inline_keyboard: [[openBtn(env, false, '▶️  Повторить', 'rev')]] } });
    await db.prepare('UPDATE reminders SET sent = ?, off = ? WHERE uid = ?').bind(now, res && res.ok === false && /blocked|deactivated|not found/i.test(res.description || '') ? 1 : 0, r.uid).run();
  }
}

/* ================= статистика и источники (для рекламы) ================= */
// users: кто пришёл, когда, откуда (метка из ссылки ?start=… или ?startapp=src_…), когда был последний раз.
// events: что делают в приложении (открыл, досмотрел эпизод, прошёл проверку, тест слов…).
// /stats — сводка для админа: новые по источникам, кто вернулся на 2-й и 7-й день, что делают.
let statsReady = false;
async function statsDb(env) {
  if (!env.DB) return null;
  if (!statsReady) {
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS users (uid INTEGER PRIMARY KEY, first INTEGER, last INTEGER, src TEXT, lang TEXT)').run();
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS events (uid INTEGER, e TEXT, sid TEXT, ts INTEGER)').run();
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS events_ts ON events (ts)').run();
    statsReady = true;
  }
  return env.DB;
}
const cleanSrc = (s) => String(s || '').toLowerCase().replace(/^src_/, '').replace(/[^a-z0-9_-]/g, '').slice(0, 32);
async function statsTouch(env, user, src) {
  try {
    const db = await statsDb(env); if (!db || !user || !user.id || isAdminId(env, user.id)) return;
    const now = Date.now();
    await db.prepare('INSERT INTO users (uid, first, last, src, lang) VALUES (?, ?, ?, ?, ?) ON CONFLICT(uid) DO UPDATE SET last = excluded.last, src = COALESCE(users.src, excluded.src)')
      .bind(user.id, now, now, cleanSrc(src) || null, String(user.language_code || '').slice(0, 5)).run();
  } catch (e) {}
}
const EV_OK = ['open', 'ep_watch', 'ep_quiz', 'word_quiz', 'review', 'dict', 'search', 'bot_start', 'sc_buy', 'pvp_end'];
async function statsEvent(env, user, e, sid) {
  try {
    if (!EV_OK.includes(e) || isAdminId(env, user.id)) return;
    const db = await statsDb(env); if (!db) return;
    await db.prepare('INSERT INTO events (uid, e, sid, ts) VALUES (?, ?, ?, ?)').bind(user.id, e, String(sid || '').slice(0, 48), Date.now()).run();
  } catch (x) {}
}
async function evApi(env, user, b) {
  await statsTouch(env, user, b.src);
  await statsEvent(env, user, String(b.e || ''), b.sid);
  return { ok: true };
}
async function statsReport(env) {
  const db = await statsDb(env); if (!db) return 'База D1 не подключена.';
  const D = 864e5, now = Date.now(), day0 = now - D, week0 = now - 7 * D;
  const one = async (q, ...a) => (await db.prepare(q).bind(...a).first()) || {};
  const all = async (q, ...a) => ((await db.prepare(q).bind(...a).all()).results) || [];
  const total = (await one('SELECT COUNT(*) n FROM users')).n || 0;
  const new1 = (await one('SELECT COUNT(*) n FROM users WHERE first > ?', day0)).n || 0;
  const new7 = (await one('SELECT COUNT(*) n FROM users WHERE first > ?', week0)).n || 0;
  const dau = (await one('SELECT COUNT(DISTINCT uid) n FROM events WHERE ts > ?', day0)).n || 0;
  const wau = (await one('SELECT COUNT(DISTINCT uid) n FROM events WHERE ts > ?', week0)).n || 0;
  // вернулись: пришли 2–14 дней назад и открывали приложение в следующий день / через 6–8 дней
  const cohort = await all('SELECT uid, first FROM users WHERE first < ? AND first > ?', now - 2 * D, now - 14 * D);
  let r1 = 0, r7 = 0, c7 = 0;
  for (const u of cohort) {
    const a = (await one('SELECT COUNT(*) n FROM events WHERE uid = ? AND ts > ? AND ts < ?', u.uid, u.first + D * 0.75, u.first + D * 2)).n;
    if (a) r1++;
    if (u.first < now - 8 * D) { c7++; const b = (await one('SELECT COUNT(*) n FROM events WHERE uid = ? AND ts > ? AND ts < ?', u.uid, u.first + 6 * D, u.first + 8 * D)).n; if (b) r7++; }
  }
  const src = await all("SELECT COALESCE(src,'без метки') s, COUNT(*) n FROM users WHERE first > ? GROUP BY s ORDER BY n DESC LIMIT 8", week0);
  const ev = await all('SELECT e, COUNT(*) n, COUNT(DISTINCT uid) u FROM events WHERE ts > ? GROUP BY e ORDER BY n DESC', week0);
  const top = await all("SELECT sid, COUNT(*) n FROM events WHERE ts > ? AND e IN ('ep_quiz','word_quiz') AND sid <> '' GROUP BY sid ORDER BY n DESC LIMIT 5", week0);
  const pct = (a, b) => (b ? Math.round((a / b) * 100) + '%' : '—');
  const EVN = { open: 'открыли приложение', ep_watch: 'досмотрели эпизод', ep_quiz: 'прошли проверку эпизода', word_quiz: 'прошли тест слов', review: 'повторение', dict: 'открыли словарь', search: 'поиск', bot_start: '/start в боте', sc_buy: 'купили сцену', pvp_end: 'сыграли дуэль по сцене' };
  return [
    '📊 <b>Статистика</b>',
    `Всего людей: <b>${total}</b> · новых за сутки: <b>${new1}</b> · за неделю: <b>${new7}</b>`,
    `Активных за сутки: <b>${dau}</b> · за неделю: <b>${wau}</b>`,
    `Вернулись на 2-й день: <b>${pct(r1, cohort.length)}</b> (из ${cohort.length}) · через неделю: <b>${pct(r7, c7)}</b> (из ${c7})`,
    '',
    '<b>Откуда пришли (неделя)</b>',
    ...(src.length ? src.map((x) => `• ${x.s}: ${x.n}`) : ['• пока никого']),
    '',
    '<b>Что делали (неделя)</b>',
    ...(ev.length ? ev.map((x) => `• ${EVN[x.e] || x.e}: ${x.n} раз, ${x.u} чел.`) : ['• пока пусто']),
    ...(top.length ? ['', '<b>Сцены, где больше всего проверок</b>', ...top.map((x) => `• ${x.sid}: ${x.n}`)] : []),
    '',
    'Метки для рекламы: ссылка <code>t.me/' + (env.BOT_USERNAME || 'languagegamesbot') + '?start=tiktok</code> — источник «tiktok».',
  ].join('\n');
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, x-init-data',
  'Access-Control-Max-Age': '86400',
};
const json = (obj, status) => new Response(JSON.stringify(obj), { status: status || 200, headers: { ...CORS, 'content-type': 'application/json; charset=utf-8' } });
const API_ROUTES = { '/api/spy': spyApi, '/api/tour': tourApi, '/api/flags': flagsApi, '/api/cg': cgApi, '/api/remind': remindApi, '/api/ev': evApi, '/api/pvp': pvpApi };

export default {
  async scheduled(event, env, ctx) { ctx.waitUntil(remindTick(env)); },
  async fetch(req, env) {
    const url = new URL(req.url);

    const api = API_ROUTES[url.pathname];
    if (api) {
      if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
      if (req.method !== 'POST') return json({ ok: false, err: 'method' }, 405);
      const user = await verifyInitData(req.headers.get('x-init-data') || '', env.BOT_TOKEN);
      if (!user) return json({ ok: false, err: 'auth', msg: 'Открой игру внутри Telegram' }, 401);
      if (!env.DB) return json({ ok: false, err: 'nodb', msg: 'Сервер игры ещё не подключён (нужна база D1)' });
      let body = {};
      try { body = await req.json(); } catch (e) {}
      try {
        return json(await api(env, user, body));
      } catch (e) {
        console.log('api error', url.pathname, e);
        return json({ ok: false, err: 'server', msg: 'Ошибка сервера, попробуй ещё раз' }, 500);
      }
    }

    if (url.pathname === '/setup') {
      if (!env.WEBHOOK_SECRET || url.searchParams.get('secret') !== env.WEBHOOK_SECRET) {
        return new Response('Неверный secret', { status: 403 });
      }
      const webhook = await tg(env, 'setWebhook', {
        url: url.origin + '/webhook', secret_token: env.WEBHOOK_SECRET,
        allowed_updates: ['message', 'callback_query', 'poll', 'poll_answer'], drop_pending_updates: true,
      });
      // в личке — только главное; в группах — то, во что играют компанией. /prize, /myid, /tour работают, но в меню не светятся
      const commands = await tg(env, 'setMyCommands', {
        commands: [
          { command: 'start', description: 'Открыть приложение' },
          { command: 'cards', description: 'Карточная дуэль (можно с другом онлайн)' },
          { command: 'spy', description: '«Шпион» с друзьями' },
          { command: 'duel', description: 'Дуэль словами прямо в чате' },
          { command: 'word', description: 'Слово дня' },
        ],
      });
      await tg(env, 'setMyCommands', {
        scope: { type: 'all_group_chats' },
        commands: [
          { command: 'quiz', description: 'Квиз в чат (en или de)' },
          { command: 'spy', description: 'Комната «Шпиона»' },
          { command: 'duel', description: 'Дуэль в чате: 10 вопросов на время' },
          { command: 'tour', description: 'Турнир недели' },
          { command: 'word', description: 'Слово дня' },
        ],
      });
      await tg(env, 'setMyDescription', { description: '🎬 Английский и немецкий по сценам из фильмов и сериалов.\n\nДвойные субтитры, разбор живых фраз, саундтреки к сценам. А ещё карточная дуэль, «Шпион» и дуэли с друзьями.\n\nЖми «Старт» 👇' });
      const menuButton = await tg(env, 'setChatMenuButton', { menu_button: { type: 'web_app', text: 'Открыть', web_app: { url: env.APP_URL } } });
      const about = await tg(env, 'setMyShortDescription', { short_description: 'Английский и немецкий по сценам из фильмов и сериалов. Карточная дуэль, «Шпион», дуэли с друзьями.' });
      let database = 'не подключена (нужна D1 с именем DB)';
      try { if (await spyDb(env)) { await tourDb(env); await cgDb(env); await flagsDb(env); await cdDb(env); await pvpDb(env); await remindDb(env); await statsDb(env); database = 'ok'; } } catch (e) { database = 'ошибка: ' + e.message; }
      return new Response(JSON.stringify({ webhook, commands, menuButton, about, database }, null, 2), {
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    if (url.pathname === '/webhook' && req.method === 'POST') {
      if (req.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.WEBHOOK_SECRET) return new Response('forbidden', { status: 403 });
      try { await onUpdate(await req.json(), env); } catch (e) { console.log('update error', e); }
      return new Response('ok');
    }

    return new Response('Бот работает 👍 Версия 12.0', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
  },
};
