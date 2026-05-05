const SURAH_DATA = {
  number: 78,
  name: "An-Naba",
  nameArabic: "النَّبَأ",
  meaning: "The Great News",
  totalAyahs: 40,
  juz: 30,
  audioBaseUrl: "https://everyayah.com/data/Alafasy_128kbps/",
  ayahs: [
    {
      number: 1,
      arabic: "عَمَّ يَتَسَاءَلُونَ",
      translation: "About what are they asking one another?",
      words: [
        { arabic: "عَمَّ", english: "About what" },
        { arabic: "يَتَسَاءَلُونَ", english: "are they asking one another" }
      ]
    },
    {
      number: 2,
      arabic: "عَنِ النَّبَإِ الْعَظِيمِ",
      translation: "About the great news",
      words: [
        { arabic: "عَنِ", english: "About" },
        { arabic: "النَّبَإِ", english: "the news" },
        { arabic: "الْعَظِيمِ", english: "the great" }
      ]
    },
    {
      number: 3,
      arabic: "الَّذِي هُمْ فِيهِ مُخْتَلِفُونَ",
      translation: "That over which they are in disagreement",
      words: [
        { arabic: "الَّذِي", english: "That which" },
        { arabic: "هُمْ", english: "they" },
        { arabic: "فِيهِ", english: "over it" },
        { arabic: "مُخْتَلِفُونَ", english: "are in disagreement" }
      ]
    },
    {
      number: 4,
      arabic: "كَلَّا سَيَعْلَمُونَ",
      translation: "No! They are going to know",
      words: [
        { arabic: "كَلَّا", english: "No" },
        { arabic: "سَيَعْلَمُونَ", english: "they are going to know" }
      ]
    },
    {
      number: 5,
      arabic: "ثُمَّ كَلَّا سَيَعْلَمُونَ",
      translation: "Then, no! They are going to know",
      words: [
        { arabic: "ثُمَّ", english: "Then" },
        { arabic: "كَلَّا", english: "no" },
        { arabic: "سَيَعْلَمُونَ", english: "they are going to know" }
      ]
    },
    {
      number: 6,
      arabic: "أَلَمْ نَجْعَلِ الْأَرْضَ مِهَادًا",
      translation: "Have We not made the earth a resting place?",
      words: [
        { arabic: "أَلَمْ", english: "Have not" },
        { arabic: "نَجْعَلِ", english: "We made" },
        { arabic: "الْأَرْضَ", english: "the earth" },
        { arabic: "مِهَادًا", english: "a resting place" }
      ]
    },
    {
      number: 7,
      arabic: "وَالْجِبَالَ أَوْتَادًا",
      translation: "And the mountains as stakes?",
      words: [
        { arabic: "وَالْجِبَالَ", english: "And the mountains" },
        { arabic: "أَوْتَادًا", english: "as stakes" }
      ]
    },
    {
      number: 8,
      arabic: "وَخَلَقْنَاكُمْ أَزْوَاجًا",
      translation: "And We created you in pairs",
      words: [
        { arabic: "وَخَلَقْنَاكُمْ", english: "And We created you" },
        { arabic: "أَزْوَاجًا", english: "in pairs" }
      ]
    },
    {
      number: 9,
      arabic: "وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا",
      translation: "And made your sleep [a means for] rest",
      words: [
        { arabic: "وَجَعَلْنَا", english: "And We made" },
        { arabic: "نَوْمَكُمْ", english: "your sleep" },
        { arabic: "سُبَاتًا", english: "a means for rest" }
      ]
    },
    {
      number: 10,
      arabic: "وَجَعَلْنَا اللَّيْلَ لِبَاسًا",
      translation: "And made the night as clothing",
      words: [
        { arabic: "وَجَعَلْنَا", english: "And We made" },
        { arabic: "اللَّيْلَ", english: "the night" },
        { arabic: "لِبَاسًا", english: "as clothing" }
      ]
    },
    {
      number: 11,
      arabic: "وَجَعَلْنَا النَّهَارَ مَعَاشًا",
      translation: "And made the day for livelihood",
      words: [
        { arabic: "وَجَعَلْنَا", english: "And We made" },
        { arabic: "النَّهَارَ", english: "the day" },
        { arabic: "مَعَاشًا", english: "for livelihood" }
      ]
    },
    {
      number: 12,
      arabic: "وَبَنَيْنَا فَوْقَكُمْ سَبْعًا شِدَادًا",
      translation: "And constructed above you seven strong [heavens]",
      words: [
        { arabic: "وَبَنَيْنَا", english: "And We constructed" },
        { arabic: "فَوْقَكُمْ", english: "above you" },
        { arabic: "سَبْعًا", english: "seven" },
        { arabic: "شِدَادًا", english: "strong" }
      ]
    },
    {
      number: 13,
      arabic: "وَجَعَلْنَا سِرَاجًا وَهَّاجًا",
      translation: "And made [therein] a burning lamp",
      words: [
        { arabic: "وَجَعَلْنَا", english: "And We made" },
        { arabic: "سِرَاجًا", english: "a lamp" },
        { arabic: "وَهَّاجًا", english: "burning" }
      ]
    },
    {
      number: 14,
      arabic: "وَأَنزَلْنَا مِنَ الْمُعْصِرَاتِ مَاءً ثَجَّاجًا",
      translation: "And sent down, from the rain clouds, pouring water",
      words: [
        { arabic: "وَأَنزَلْنَا", english: "And We sent down" },
        { arabic: "مِنَ", english: "from" },
        { arabic: "الْمُعْصِرَاتِ", english: "the rain clouds" },
        { arabic: "مَاءً", english: "water" },
        { arabic: "ثَجَّاجًا", english: "pouring" }
      ]
    },
    {
      number: 15,
      arabic: "لِّنُخْرِجَ بِهِ حَبًّا وَنَبَاتًا",
      translation: "That We may bring forth thereby grain and vegetation",
      words: [
        { arabic: "لِّنُخْرِجَ", english: "That We may bring forth" },
        { arabic: "بِهِ", english: "thereby" },
        { arabic: "حَبًّا", english: "grain" },
        { arabic: "وَنَبَاتًا", english: "and vegetation" }
      ]
    },
    {
      number: 16,
      arabic: "وَجَنَّاتٍ أَلْفَافًا",
      translation: "And gardens of entwined growth",
      words: [
        { arabic: "وَجَنَّاتٍ", english: "And gardens" },
        { arabic: "أَلْفَافًا", english: "of entwined growth" }
      ]
    },
    {
      number: 17,
      arabic: "إِنَّ يَوْمَ الْفَصْلِ كَانَ مِيقَاتًا",
      translation: "Indeed, the Day of Judgement is an appointed time",
      words: [
        { arabic: "إِنَّ", english: "Indeed" },
        { arabic: "يَوْمَ", english: "the Day" },
        { arabic: "الْفَصْلِ", english: "of Judgement" },
        { arabic: "كَانَ", english: "is" },
        { arabic: "مِيقَاتًا", english: "an appointed time" }
      ]
    },
    {
      number: 18,
      arabic: "يَوْمَ يُنفَخُ فِي الصُّورِ فَتَأْتُونَ أَفْوَاجًا",
      translation: "The Day the Horn is blown and you will come forth in multitudes",
      words: [
        { arabic: "يَوْمَ", english: "The Day" },
        { arabic: "يُنفَخُ", english: "is blown" },
        { arabic: "فِي", english: "in" },
        { arabic: "الصُّورِ", english: "the Horn" },
        { arabic: "فَتَأْتُونَ", english: "and you will come forth" },
        { arabic: "أَفْوَاجًا", english: "in multitudes" }
      ]
    },
    {
      number: 19,
      arabic: "وَفُتِحَتِ السَّمَاءُ فَكَانَتْ أَبْوَابًا",
      translation: "And the heaven is opened and will become gateways",
      words: [
        { arabic: "وَفُتِحَتِ", english: "And is opened" },
        { arabic: "السَّمَاءُ", english: "the heaven" },
        { arabic: "فَكَانَتْ", english: "and will become" },
        { arabic: "أَبْوَابًا", english: "gateways" }
      ]
    },
    {
      number: 20,
      arabic: "وَسُيِّرَتِ الْجِبَالُ فَكَانَتْ سَرَابًا",
      translation: "And the mountains are removed and will be [but] a mirage",
      words: [
        { arabic: "وَسُيِّرَتِ", english: "And are removed" },
        { arabic: "الْجِبَالُ", english: "the mountains" },
        { arabic: "فَكَانَتْ", english: "and will be" },
        { arabic: "سَرَابًا", english: "a mirage" }
      ]
    },
    {
      number: 21,
      arabic: "إِنَّ جَهَنَّمَ كَانَتْ مِرْصَادًا",
      translation: "Indeed, Hell has been lying in wait",
      words: [
        { arabic: "إِنَّ", english: "Indeed" },
        { arabic: "جَهَنَّمَ", english: "Hell" },
        { arabic: "كَانَتْ", english: "has been" },
        { arabic: "مِرْصَادًا", english: "lying in wait" }
      ]
    },
    {
      number: 22,
      arabic: "لِّلطَّاغِينَ مَآبًا",
      translation: "For the transgressors, a place of return",
      words: [
        { arabic: "لِّلطَّاغِينَ", english: "For the transgressors" },
        { arabic: "مَآبًا", english: "a place of return" }
      ]
    },
    {
      number: 23,
      arabic: "لَابِثِينَ فِيهَا أَحْقَابًا",
      translation: "In which they will remain for ages [unending]",
      words: [
        { arabic: "لَابِثِينَ", english: "They will remain" },
        { arabic: "فِيهَا", english: "in it" },
        { arabic: "أَحْقَابًا", english: "for ages" }
      ]
    },
    {
      number: 24,
      arabic: "لَّا يَذُوقُونَ فِيهَا بَرْدًا وَلَا شَرَابًا",
      translation: "They will not taste therein [any] coolness or drink",
      words: [
        { arabic: "لَّا", english: "Not" },
        { arabic: "يَذُوقُونَ", english: "they will taste" },
        { arabic: "فِيهَا", english: "therein" },
        { arabic: "بَرْدًا", english: "coolness" },
        { arabic: "وَلَا", english: "and not" },
        { arabic: "شَرَابًا", english: "drink" }
      ]
    },
    {
      number: 25,
      arabic: "إِلَّا حَمِيمًا وَغَسَّاقًا",
      translation: "Except scalding water and [foul] purulence",
      words: [
        { arabic: "إِلَّا", english: "Except" },
        { arabic: "حَمِيمًا", english: "scalding water" },
        { arabic: "وَغَسَّاقًا", english: "and purulence" }
      ]
    },
    {
      number: 26,
      arabic: "جَزَاءً وِفَاقًا",
      translation: "An appropriate recompense",
      words: [
        { arabic: "جَزَاءً", english: "A recompense" },
        { arabic: "وِفَاقًا", english: "appropriate" }
      ]
    },
    {
      number: 27,
      arabic: "إِنَّهُمْ كَانُوا لَا يَرْجُونَ حِسَابًا",
      translation: "Indeed, they were not expecting an account",
      words: [
        { arabic: "إِنَّهُمْ", english: "Indeed, they" },
        { arabic: "كَانُوا", english: "were" },
        { arabic: "لَا", english: "not" },
        { arabic: "يَرْجُونَ", english: "expecting" },
        { arabic: "حِسَابًا", english: "an account" }
      ]
    },
    {
      number: 28,
      arabic: "وَكَذَّبُوا بِآيَاتِنَا كِذَّابًا",
      translation: "And denied Our verses with [emphatic] denial",
      words: [
        { arabic: "وَكَذَّبُوا", english: "And they denied" },
        { arabic: "بِآيَاتِنَا", english: "Our verses" },
        { arabic: "كِذَّابًا", english: "with emphatic denial" }
      ]
    },
    {
      number: 29,
      arabic: "وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ كِتَابًا",
      translation: "But all things We have enumerated in writing",
      words: [
        { arabic: "وَكُلَّ", english: "And all" },
        { arabic: "شَيْءٍ", english: "things" },
        { arabic: "أَحْصَيْنَاهُ", english: "We have enumerated it" },
        { arabic: "كِتَابًا", english: "in writing" }
      ]
    },
    {
      number: 30,
      arabic: "فَذُوقُوا فَلَن نَّزِيدَكُمْ إِلَّا عَذَابًا",
      translation: "So taste [the penalty], and never will We increase you except in torment",
      words: [
        { arabic: "فَذُوقُوا", english: "So taste" },
        { arabic: "فَلَن", english: "and never will" },
        { arabic: "نَّزِيدَكُمْ", english: "We increase you" },
        { arabic: "إِلَّا", english: "except" },
        { arabic: "عَذَابًا", english: "in torment" }
      ]
    },
    {
      number: 31,
      arabic: "إِنَّ لِلْمُتَّقِينَ مَفَازًا",
      translation: "Indeed, for the righteous is attainment",
      words: [
        { arabic: "إِنَّ", english: "Indeed" },
        { arabic: "لِلْمُتَّقِينَ", english: "for the righteous" },
        { arabic: "مَفَازًا", english: "is attainment" }
      ]
    },
    {
      number: 32,
      arabic: "حَدَائِقَ وَأَعْنَابًا",
      translation: "Gardens and grapevines",
      words: [
        { arabic: "حَدَائِقَ", english: "Gardens" },
        { arabic: "وَأَعْنَابًا", english: "and grapevines" }
      ]
    },
    {
      number: 33,
      arabic: "وَكَوَاعِبَ أَتْرَابًا",
      translation: "And full-breasted [companions] of equal age",
      words: [
        { arabic: "وَكَوَاعِبَ", english: "And full-breasted companions" },
        { arabic: "أَتْرَابًا", english: "of equal age" }
      ]
    },
    {
      number: 34,
      arabic: "وَكَأْسًا دِهَاقًا",
      translation: "And a full cup",
      words: [
        { arabic: "وَكَأْسًا", english: "And a cup" },
        { arabic: "دِهَاقًا", english: "full" }
      ]
    },
    {
      number: 35,
      arabic: "لَّا يَسْمَعُونَ فِيهَا لَغْوًا وَلَا كِذَّابًا",
      translation: "No ill speech will they hear therein or any falsehood",
      words: [
        { arabic: "لَّا", english: "No" },
        { arabic: "يَسْمَعُونَ", english: "they will hear" },
        { arabic: "فِيهَا", english: "therein" },
        { arabic: "لَغْوًا", english: "ill speech" },
        { arabic: "وَلَا", english: "and not" },
        { arabic: "كِذَّابًا", english: "any falsehood" }
      ]
    },
    {
      number: 36,
      arabic: "جَزَاءً مِّن رَّبِّكَ عَطَاءً حِسَابًا",
      translation: "[As] reward from your Lord, [a generous] gift [made due by] account",
      words: [
        { arabic: "جَزَاءً", english: "A reward" },
        { arabic: "مِّن", english: "from" },
        { arabic: "رَّبِّكَ", english: "your Lord" },
        { arabic: "عَطَاءً", english: "a gift" },
        { arabic: "حِسَابًا", english: "made due by account" }
      ]
    },
    {
      number: 37,
      arabic: "رَّبِّ السَّمَاوَاتِ وَالْأَرْضِ وَمَا بَيْنَهُمَا الرَّحْمَٰنِ ۖ لَا يَمْلِكُونَ مِنْهُ خِطَابًا",
      translation: "[From] the Lord of the heavens and the earth and whatever is between them, the Most Merciful. They possess not from Him [authority for] speech",
      words: [
        { arabic: "رَّبِّ", english: "The Lord" },
        { arabic: "السَّمَاوَاتِ", english: "of the heavens" },
        { arabic: "وَالْأَرْضِ", english: "and the earth" },
        { arabic: "وَمَا", english: "and whatever" },
        { arabic: "بَيْنَهُمَا", english: "is between them" },
        { arabic: "الرَّحْمَٰنِ", english: "the Most Merciful" },
        { arabic: "لَا", english: "not" },
        { arabic: "يَمْلِكُونَ", english: "they possess" },
        { arabic: "مِنْهُ", english: "from Him" },
        { arabic: "خِطَابًا", english: "authority for speech" }
      ]
    },
    {
      number: 38,
      arabic: "يَوْمَ يَقُومُ الرُّوحُ وَالْمَلَائِكَةُ صَفًّا ۖ لَّا يَتَكَلَّمُونَ إِلَّا مَنْ أَذِنَ لَهُ الرَّحْمَٰنُ وَقَالَ صَوَابًا",
      translation: "The Day that the Spirit and the angels will stand in rows, they will not speak except for one whom the Most Merciful permits, and he will say what is correct",
      words: [
        { arabic: "يَوْمَ", english: "The Day" },
        { arabic: "يَقُومُ", english: "will stand" },
        { arabic: "الرُّوحُ", english: "the Spirit" },
        { arabic: "وَالْمَلَائِكَةُ", english: "and the angels" },
        { arabic: "صَفًّا", english: "in rows" },
        { arabic: "لَّا", english: "not" },
        { arabic: "يَتَكَلَّمُونَ", english: "they will speak" },
        { arabic: "إِلَّا", english: "except" },
        { arabic: "مَنْ", english: "one whom" },
        { arabic: "أَذِنَ", english: "permits" },
        { arabic: "لَهُ", english: "for him" },
        { arabic: "الرَّحْمَٰنُ", english: "the Most Merciful" },
        { arabic: "وَقَالَ", english: "and he will say" },
        { arabic: "صَوَابًا", english: "what is correct" }
      ]
    },
    {
      number: 39,
      arabic: "ذَٰلِكَ الْيَوْمُ الْحَقُّ ۖ فَمَن شَاءَ اتَّخَذَ إِلَىٰ رَبِّهِ مَآبًا",
      translation: "That is the True Day; so he who wills may take to his Lord a [way of] return",
      words: [
        { arabic: "ذَٰلِكَ", english: "That is" },
        { arabic: "الْيَوْمُ", english: "the Day" },
        { arabic: "الْحَقُّ", english: "the True" },
        { arabic: "فَمَن", english: "so he who" },
        { arabic: "شَاءَ", english: "wills" },
        { arabic: "اتَّخَذَ", english: "may take" },
        { arabic: "إِلَىٰ", english: "to" },
        { arabic: "رَبِّهِ", english: "his Lord" },
        { arabic: "مَآبًا", english: "a way of return" }
      ]
    },
    {
      number: 40,
      arabic: "إِنَّا أَنذَرْنَاكُمْ عَذَابًا قَرِيبًا يَوْمَ يَنظُرُ الْمَرْءُ مَا قَدَّمَتْ يَدَاهُ وَيَقُولُ الْكَافِرُ يَا لَيْتَنِي كُنتُ تُرَابًا",
      translation: "Indeed, We have warned you of a near punishment on the Day when a man will observe what his hands have put forth and the disbeliever will say, 'Oh, I wish that I were dust!'",
      words: [
        { arabic: "إِنَّا", english: "Indeed, We" },
        { arabic: "أَنذَرْنَاكُمْ", english: "have warned you" },
        { arabic: "عَذَابًا", english: "of a punishment" },
        { arabic: "قَرِيبًا", english: "near" },
        { arabic: "يَوْمَ", english: "on the Day" },
        { arabic: "يَنظُرُ", english: "will observe" },
        { arabic: "الْمَرْءُ", english: "a man" },
        { arabic: "مَا", english: "what" },
        { arabic: "قَدَّمَتْ", english: "have put forth" },
        { arabic: "يَدَاهُ", english: "his hands" },
        { arabic: "وَيَقُولُ", english: "and will say" },
        { arabic: "الْكَافِرُ", english: "the disbeliever" },
        { arabic: "يَا لَيْتَنِي", english: "Oh, I wish that I" },
        { arabic: "كُنتُ", english: "were" },
        { arabic: "تُرَابًا", english: "dust" }
      ]
    }
  ],
  videos: [
    {
      id: "8mqqgndbpss",
      title: "FULL Surah Naba Tafsir by Nouman Ali Khan ft Mufti Menk Reciting",
      channel: "Nouman Ali Khan / Mufti Menk",
      description: "A complete tafsir of Surah An-Naba with Nouman Ali Khan explaining the meaning and Mufti Menk providing the recitation. Covers the entire surah with beautiful kinetic typography. An excellent starting point for understanding the surah's flow from questioning to judgment.",
      tags: ["Full Tafsir", "Kinetic Typography", "Beginner-Friendly"],
      ayahsCovered: "1–40 (Full Surah)",
      scores: { authority: 5, relevance: 5, depth: 5, engagement: 5, clarity: 5 }
    },
    {
      id: "WNVU0JpHSzw",
      title: "This Is Our Ultimate Reality on Judgement Day — Surah An-Naba",
      channel: "Nouman Ali Khan",
      description: "Part of the Deeper Look Series. Nouman Ali Khan walks through the Day of Judgment imagery in Surah An-Naba — the Horn being blown, the heavens opening, and the consequences for those who denied. A sobering, detailed exploration of accountability.",
      tags: ["Day of Judgment", "Deeper Look Series", "Accountability"],
      ayahsCovered: "1–40 (Full Surah)",
      scores: { authority: 5, relevance: 5, depth: 5, engagement: 5, clarity: 5 }
    },
    {
      id: "NSjVzidmhQo",
      title: "Part 1: The Scenario — Surah Naba Tafsir",
      channel: "Green Bird Media / Nouman Ali Khan",
      description: "A well-produced tafsir of the opening of Surah An-Naba. Breaks down the dramatic opening question — 'About what are they asking one another?' — and why Allah chose this rhetorical approach to confront the deniers of the Hereafter.",
      tags: ["Opening Verses", "Rhetoric", "Production Quality"],
      ayahsCovered: "1–5",
      scores: { authority: 5, relevance: 5, depth: 4, engagement: 5, clarity: 5 }
    },
    {
      id: "ZKgJhlL4_80",
      playlist: "PLYO6Oz7uwCSiIvS8fBim58larO1tRs9uI",
      title: "Quran Tafsir Series — Surah Naba to Ghashiyya (Full Playlist)",
      channel: "Dr. Yasir Qadhi & Shaykh Sajjad Gul",
      description: "Part of a comprehensive 30-session Quran tafsir playlist. Session #29 covers Surah An-Naba through Al-Ghashiyya. Links to the full playlist so you can browse all sessions.",
      tags: ["Full Tafsir Series", "Scholarly Duo", "Playlist"],
      ayahsCovered: "1–40 (Full Surah)",
      scores: { authority: 5, relevance: 4, depth: 5, engagement: 4, clarity: 5 }
    }
  ]
};
