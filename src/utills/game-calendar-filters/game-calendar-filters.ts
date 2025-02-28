const filterdata = {
  sortby: [
    { by: "Anticipated", order: "asc" },
    { by: "Title", order: "DESC" },
    { by: "Hot", order: "DESC" },
    { by: "Date", order: "DESC" },
  ],
  onlyanticipated: [
    { label: "Only Anticipated Games", key: "onlyAnticipated" },
  ],
  genres: [
    {
      id: 2,
      name: "Point-and-click",
    },
    {
      id: 4,
      name: "Fighting",
    },
    {
      id: 5,
      name: "Shooter",
    },
    {
      id: 7,
      name: "Music",
    },
    {
      id: 8,
      name: "Platform",
    },
    {
      id: 9,
      name: "Puzzle",
    },
    {
      id: 10,
      name: "Racing",
    },
    {
      id: 11,
      name: "Real Time Strategy (RTS)",
    },
    {
      id: 12,
      name: "Role-playing (RPG)",
    },
    {
      id: 13,
      name: "Simulator",
    },
    {
      id: 14,
      name: "Sport",
    },
    {
      id: 15,
      name: "Strategy",
    },
    {
      id: 16,
      name: "Turn-based strategy (TBS)",
    },
    {
      id: 24,
      name: "Tactical",
    },
    {
      id: 25,
      name: "Hack and slash/Beat 'em up",
    },
    {
      id: 26,
      name: "Quiz/Trivia",
    },
    {
      id: 30,
      name: "Pinball",
    },
    {
      id: 31,
      name: "Adventure",
    },
    {
      id: 32,
      name: "Indie",
    },
    {
      id: 33,
      name: "Arcade",
    },
    {
      id: 34,
      name: "Visual Novel",
    },
    {
      id: 35,
      name: "Card & Board Game",
    },
    {
      id: 36,
      name: "MOBA",
    },
  ],
  timeframe: [
    { label: "Daily", key: "daily" },
    { label: "Weekly", key: "weekly" },
    { label: "Monthly", key: "monthly" },
  ],
  gametype: [
    { label: "Base Game", key: "BaseGame" },
    { label: "Expansions", key: "Expansions" },
    { label: "Seasons", key: "Seasons" },
  ],
  devices: [
    {
      name: "My Devices",
      key: "My Devices",
    },
    {
      "id": 302,
      "name": "Amstrad GX4000",
      "key": "Amstrad GX4000",
      "slug": "amstrad-gx4000",

    },
    {
      "id": 316,
      "name": "Advanced Pico Beena",
      "slug": null,
      "key": "Advanced Pico Beena",

    },

 

    {
      id: 3,
      name: "PC",
      key: "PC",
    },
    {
      id: 62,
      name: "Atari Jaguar",
      key: "Atari Jaguar",
    },
    {
      id: 477,
      name: "Panasonic Jungle",
      key: "Panasonic Jungle",
    },
    {
      id: 504,
      name: "Uzebox",
      key: "Uzebox",
    },
    {
      id: 148,
      name: "AY-3-8607",
      key: "AY-3-8607",
    },
    {
      id: 65,
      name: "Atari 8-bit",
      key: "Atari 8-bit",
    },
    {
      id: 128,
      name: "PC Engine SuperGrafx",
      key: "PC Engine SuperGrafx",
    },
    {
      id: 89,
      name: "Microvision",
      key: "Microvision",
    },
    {
      id: 8,
      name: "PlayStation 2",
      key: "PlayStation 2",
    },
    {
      id: 6,
      name: "PC (Microsoft Windows)",
      key: "PC (Microsoft Windows)",
    },
    {
      id: 23,
      name: "Dreamcast",
      key: "Dreamcast",
    },
    {
      id: 35,
      name: "Sega Game Gear",
      key: "Sega Game Gear",
    },
    {
      id: 44,
      name: "Tapwave Zodiac",
      key: "Tapwave Zodiac",
    },
    {
      id: 88,
      name: "Odyssey",
      key: "Odyssey",
    },
    {
      id: 94,
      name: "Commodore Plus/4",
      key: "Commodore Plus/4",
    },
    {
      id: 123,
      name: "WonderSwan Color",
      key: "WonderSwan Color",
    },
    {
      id: 134,
      name: "Acorn Electron",
      key: "Acorn Electron",
    },
    {
      id: 129,
      name: "Texas Instruments TI-99",
      key: "Texas Instruments TI-99",
    },
    {
      id: 133,
      name: "Odyssey 2 / Videopac G7000",
      key: "Odyssey 2 / Videopac G7000",
    },
    {
      id: 135,
      name: "Hyper Neo Geo 64",
      key: "Hyper Neo Geo 64",
    },
    {
      id: 136,
      name: "Neo Geo CD",
      key: "Neo Geo CD",
    },
    {
      id: 142,
      name: "PC-50X Family",
      key: "PC-50X Family",
    },
    {
      id: 144,
      name: "AY-3-8710",
      key: "AY-3-8710",
    },
    {
      id: 146,
      name: "AY-3-8605",
      key: "AY-3-8605",
    },
    {
      id: 147,
      name: "AY-3-8606",
      key: "AY-3-8606",
    },
    {
      id: 149,
      name: "PC-9800 Series",
      key: "PC-9800 Series",
    },
    {
      id: 150,
      name: "Turbografx-16/PC Engine CD",
      key: "Turbografx-16/PC Engine CD",
    },
    {
      id: 505,
      name: "Elektor TV Games Computer",
      key: "Elektor TV Games Computer",
    },
    {
      id: 156,
      name: "Thomson MO5",
      key: "Thomson MO5",
    },
    {
      id: 158,
      name: "Commodore CDTV",
      key: "Commodore CDTV",
    },
    {
      id: 163,
      name: "SteamVR",
      key: "SteamVR",
    },
    {
      id: 237,
      name: "Sol-20",
      key: "Sol-20",
    },
    {
      id: 13,
      name: "DOS",
      key: "DOS",
    },
    {
      id: 24,
      name: "Game Boy Advance",
      key: "Game Boy Advance",
    },
    {
      id: 30,
      name: "Sega 32X",
      key: "Sega 32X",
    },
    {
      id: 85,
      name: "Donner Model 30",
      key: "Donner Model 30",
    },
    {
      id: 119,
      name: "Neo Geo Pocket",
      key: "Neo Geo Pocket",
    },
    {
      id: 41,
      name: "Wii U",
      key: "Wii U",
    },
    {
      id: 53,
      name: "MSX2",
      key: "MSX2",
    },
    {
      id: 140,
      name: "AY-3-8500",
      key: "AY-3-8500",
    },
    {
      id: 143,
      name: "AY-3-8760",
      key: "AY-3-8760",
    },
    {
      id: 60,
      name: "Atari 7800",
      key: "Atari 7800",
    },
    {
      id: 70,
      name: "Vectrex",
      key: "Vectrex",
    },
    {
      id: 145,
      name: "AY-3-8603",
      key: "AY-3-8603",
    },
    {
      id: 77,
      name: "Sharp X1",
      key: "Sharp X1",
    },
    {
      id: 78,
      name: "Sega CD",
      key: "Sega CD",
    },
    {
      id: 87,
      name: "Virtual Boy",
      key: "Virtual Boy",
    },
    {
      id: 97,
      name: "PDP-8",
      key: "PDP-8",
    },
    {
      id: 98,
      name: "DEC GT40",
      key: "DEC GT40",
    },
    {
      id: 101,
      name: "Ferranti Nimrod Computer",
      key: "Ferranti Nimrod Computer",
    },
    {
      id: 108,
      name: "PDP-11",
      key: "PDP-11",
    },
    {
      id: 109,
      name: "CDC Cyber 70",
      key: "CDC Cyber 70",
    },
    {
      id: 112,
      name: "Microcomputer",
      key: "Microcomputer",
    },
    {
      id: 113,
      name: "OnLive Game System",
      key: "OnLive Game System",
    },
    {
      id: 115,
      name: "Apple IIGS",
      key: "Apple IIGS",
    },
    {
      id: 120,
      name: "Neo Geo Pocket Color",
      key: "Neo Geo Pocket Color",
    },
    {
      id: 124,
      name: "SwanCrystal",
      key: "SwanCrystal",
    },
    {
      id: 125,
      name: "PC-8800 Series",
      key: "PC-8800 Series",
    },
    {
      id: 127,
      name: "Fairchild Channel F",
      key: "Fairchild Channel F",
    },
    {
      id: 132,
      name: "Amazon Fire TV",
      key: "Amazon Fire TV",
    },
    {
      id: 138,
      name: "VC 4000",
      key: "VC 4000",
    },
    {
      id: 139,
      name: "1292 Advanced Programmable Video System",
      key: "1292 Advanced Programmable Video System",
    },
    {
      id: 153,
      name: "Dragon 32/64",
      key: "Dragon 32/64",
    },
    {
      id: 154,
      name: "Amstrad PCW",
      key: "Amstrad PCW",
    },
    {
      id: 155,
      name: "Tatung Einstein",
      key: "Tatung Einstein",
    },
    {
      id: 306,
      name: "Satellaview",
      key: "Satellaview",
    },
    {
      id: 307,
      name: "Game & Watch",
      key: "Game & Watch",
    },
    {
      id: 308,
      name: "Playdia",
      key: "Playdia",
    },
    {
      id: 131,
      name: "Super NES CD-ROM System",
      key: "Super NES CD-ROM System",
    },
    {
      id: 9,
      name: "PlayStation 3",
      key: "PlayStation 3",
    },
    {
      id: 61,
      name: "Atari Lynx",
      key: "Atari Lynx",
    },
    {
      id: 11,
      name: "Xbox",
      key: "Xbox",
    },
    {
      id: 15,
      name: "Commodore C64/128/MAX",
      key: "Commodore C64/128/MAX",
    },
    {
      id: 18,
      name: "Nintendo Entertainment System",
      key: "Nintendo Entertainment System",
    },
    {
      id: 66,
      name: "Atari 5200",
      key: "Atari 5200",
    },
    {
      id: 111,
      name: "Imlac PDS-1",
      key: "Imlac PDS-1",
    },
    {
      id: 22,
      name: "Game Boy Color",
      key: "Game Boy Color",
    },
    {
      id: 32,
      name: "Sega Saturn",
      key: "Sega Saturn",
    },
    {
      id: 46,
      name: "PlayStation Vita",
      key: "PlayStation Vita",
    },
    {
      id: 67,
      name: "Intellivision",
      key: "Intellivision",
    },
    {
      id: 73,
      name: "BlackBerry OS",
      key: "BlackBerry OS",
    },
    {
      id: 86,
      name: "TurboGrafx-16/PC Engine",
      key: "TurboGrafx-16/PC Engine",
    },
    {
      id: 114,
      name: "Amiga CD32",
      key: "Amiga CD32",
    },
    {
      id: 116,
      name: "Acorn Archimedes",
      key: "Acorn Archimedes",
    },
    {
      id: 117,
      name: "Philips CD-i",
      key: "Philips CD-i",
    },
    {
      id: 118,
      name: "FM Towns",
      key: "FM Towns",
    },
    {
      id: 121,
      name: "Sharp X68000",
      key: "Sharp X68000",
    },
    {
      id: 122,
      name: "Nuon",
      key: "Nuon",
    },
    {
      id: 141,
      name: "AY-3-8610",
      key: "AY-3-8610",
    },
    {
      id: 152,
      name: "FM-7",
      key: "FM-7",
    },
    {
      id: 157,
      name: "NEC PC-6000 Series",
      key: "NEC PC-6000 Series",
    },
    {
      id: 162,
      name: "Oculus VR",
      key: "Oculus VR",
    },
    {
      id: 20,
      name: "Nintendo DS",
      key: "Nintendo DS",
    },
    {
      id: 57,
      name: "WonderSwan",
      key: "WonderSwan",
    },
    {
      id: 69,
      name: "BBC Microcomputer System",
      key: "BBC Microcomputer System",
    },
    {
      id: 71,
      name: "Commodore VIC-20",
      key: "Commodore VIC-20",
    },
    {
      id: 339,
      name: "Sega Pico",
      key: "Sega Pico",
    },
    {
      id: 379,
      name: "Game.com",
      key: "Game.com",
    },
    {
      id: 382,
      name: "Intellivision Amico",
      key: "Intellivision Amico",
    },
    {
      id: 387,
      name: "Oculus Go",
      key: "Oculus Go",
    },
    {
      id: 374,
      name: "Sharp MZ-2200",
      key: "Sharp MZ-2200",
    },
    {
      id: 74,
      name: "Windows Phone",
      key: "Windows Phone",
    },
    {
      id: 79,
      name: "Neo Geo MVS",
      key: "Neo Geo MVS",
    },
    {
      id: 388,
      name: "Gear VR",
      key: "Gear VR",
    },
    {
      id: 80,
      name: "Neo Geo AES",
      key: "Neo Geo AES",
    },
    {
      id: 375,
      name: "Epoch Cassette Vision",
      key: "Epoch Cassette Vision",
    },
    {
      id: 376,
      name: "Epoch Super Cassette Vision",
      key: "Epoch Super Cassette Vision",
    },
    {
      id: 84,
      name: "SG-1000",
      key: "SG-1000",
    },
    {
      id: 91,
      name: "Bally Astrocade",
      key: "Bally Astrocade",
    },
    {
      id: 170,
      name: "Google Stadia",
      key: "Google Stadia",
    },
    {
      id: 377,
      name: "Plug & Play",
      key: "Plug & Play",
    },
    {
      id: 384,
      name: "Oculus Quest",
      key: "Oculus Quest",
    },
    {
      id: 385,
      name: "Oculus Rift",
      key: "Oculus Rift",
    },
    {
      id: 21,
      name: "Nintendo GameCube",
      key: "Nintendo GameCube",
    },
    {
      id: 33,
      name: "Game Boy",
      key: "Game Boy",
    },
    {
      id: 42,
      name: "N-Gage",
      key: "N-Gage",
    },
    {
      id: 93,
      name: "Commodore 16",
      key: "Commodore 16",
    },
    {
      id: 96,
      name: "PDP-10",
      key: "PDP-10",
    },
    {
      id: 161,
      name: "Windows Mixed Reality",
      key: "Windows Mixed Reality",
    },
    {
      id: 479,
      name: "Terebikko / See 'n Say Video Phone",
      key: "Terebikko / See 'n Say Video Phone",
    },
    {
      id: 167,
      name: "PlayStation 5",
      key: "PlayStation 5",
    },
    {
      id: 50,
      name: "3DO Interactive Multiplayer",
      key: "3DO Interactive Multiplayer",
    },
    {
      id: 137,
      name: "New Nintendo 3DS",
      key: "New Nintendo 3DS",
    },
    {
      id: 64,
      name: "Sega Master System/Mark III",
      key: "Sega Master System/Mark III",
    },
    {
      id: 274,
      name: "PC-FX",
      key: "PC-FX",
    },
    {
      id: 309,
      name: "Evercade",
      key: "Evercade",
    },
    {
      id: 381,
      name: "Playdate",
      key: "Playdate",
    },
    {
      id: 95,
      name: "PDP-1",
      key: "PDP-1",
    },
    {
      id: 110,
      name: "PLATO",
      key: "PLATO",
    },
    {
      id: 372,
      name: "OOParts",
      key: "OOParts",
    },
    {
      id: 378,
      name: "Gamate",
      key: "Gamate",
    },
    {
      id: 380,
      name: "Casio Loopy",
      key: "Casio Loopy",
    },
    {
      id: 100,
      name: "Analogue electronics",
      key: "Analogue electronics",
    },
    {
      id: 478,
      name: "Panasonic M2",
      key: "Panasonic M2",
    },
    {
      id: 236,
      name: "Exidy Sorcerer",
      key: "Exidy Sorcerer",
    },
    {
      id: 26,
      name: "ZX Spectrum",
      key: "ZX Spectrum",
    },
    {
      id: 102,
      name: "EDSAC",
      key: "EDSAC",
    },
    {
      id: 103,
      name: "PDP-7",
      key: "PDP-7",
    },
    {
      id: 27,
      name: "MSX",
      key: "MSX",
    },
    {
      id: 104,
      name: "HP 2100",
      key: "HP 2100",
    },
    {
      id: 166,
      name: "Pokémon mini",
      key: "Pokémon mini",
    },
    {
      id: 105,
      name: "HP 3000",
      key: "HP 3000",
    },
    {
      id: 106,
      name: "SDS Sigma 7",
      key: "SDS Sigma 7",
    },
    {
      id: 37,
      name: "Nintendo 3DS",
      key: "Nintendo 3DS",
    },
    {
      id: 38,
      name: "PlayStation Portable",
      key: "PlayStation Portable",
    },
    {
      "id": 1,
      "name": "Xbox Series X",
      "slug": "xsx",
      "key": "Xbox Series X",
    },
    {
      id: 107,
      name: "Call-A-Computer time-shared mainframe computer system",
      key: "Call-A-Computer time-shared mainframe computer system",
    },
    {
      id: 151,
      name: "TRS-80 Color Computer",
      key: "TRS-80 Color Computer",
    },
    {
      id: 164,
      name: "Daydream",
      key: "Daydream",
    },
    {
      id: 169,
      name: "Xbox Series X|S",
      key: "Xbox Series X|S",
    },
    {
      id: 203,
      name: "DUPLICATE Stadia",
      key: "DUPLICATE Stadia",
    },
    {
      id: 238,
      name: "DVD Player",
      key: "DVD Player",
    },
    {
      id: 239,
      name: "Blu-ray Player",
      key: "Blu-ray Player",
    },
    {
      id: 240,
      name: "Zeebo",
      key: "Zeebo",
    },
    {
      id: 386,
      name: "Meta Quest 2",
      key: "Meta Quest 2",
    },
    {
      id: 99,
      name: "Family Computer",
      key: "Family Computer",
    },
    {
      id: 165,
      name: "PlayStation VR",
      key: "PlayStation VR",
    },
    {
      id: 405,
      name: "Windows Mobile",
      key: "Windows Mobile",
    },
    {
      id: 389,
      name: "AirConsole",
      key: "AirConsole",
    },
    {
      id: 390,
      name: "PlayStation VR2",
      key: "PlayStation VR2",
    },
    {
      id: 406,
      name: "Sinclair QL",
      key: "Sinclair QL",
    },
    {
      id: 407,
      name: "HyperScan",
      key: "HyperScan",
    },
    {
      id: 408,
      name: "Mega Duck/Cougar Boy",
      key: "Mega Duck/Cougar Boy",
    },
    {
      id: 410,
      name: "Atari Jaguar CD",
      key: "Atari Jaguar CD",
    },
    {
      id: 411,
      name: "Handheld Electronic LCD",
      key: "Handheld Electronic LCD",
    },
    {
      id: 409,
      name: "Legacy Computer",
      key: "Legacy Computer",
    },
    {
      id: 412,
      name: "Leapster",
      key: "Leapster",
    },
    {
      id: 414,
      name: "LeapTV",
      key: "LeapTV",
    },
    {
      id: 413,
      name: "Leapster Explorer/LeadPad Explorer",
      key: "Leapster Explorer/LeadPad Explorer",
    },
    {
      id: 438,
      name: "Arduboy",
      key: "Arduboy",
    },
    {
      id: 415,
      name: "Watara/QuickShot Supervision",
      key: "Watara/QuickShot Supervision",
    },
    {
      id: 439,
      name: "V.Smile",
      key: "V.Smile",
    },
    {
      id: 441,
      name: "PocketStation",
      key: "PocketStation",
    },
    {
      id: 417,
      name: "Palm OS",
      key: "Palm OS",
    },
    {
      id: 7,
      name: "PlayStation",
      key: "PlayStation",
    },
    {
      id: 416,
      name: "64DD",
      key: "64DD",
    },
    {
      id: 16,
      name: "Amiga",
      key: "Amiga",
    },
    {
      id: 471,
      name: "Meta Quest 3",
      key: "Meta Quest 3",
    },
    {
      id: 480,
      name: "Super A'Can",
      key: "Super A'Can",
    },
    {
      id: 47,
      name: "Virtual Console",
      key: "Virtual Console",
    },
    {
      id: 440,
      name: "Visual Memory Unit / Visual Memory System",
      key: "Visual Memory Unit / Visual Memory System",
    },
    {
      id: 472,
      name: "visionOS",
      key: "visionOS",
    },
    {
      id: 473,
      name: "Arcadia 2001",
      key: "Arcadia 2001",
    },
    {
      id: 51,
      name: "Family Computer Disk System",
      key: "Family Computer Disk System",
    },
    {
      id: 474,
      name: "Gizmondo",
      key: "Gizmondo",
    },
    {
      id: 25,
      name: "Amstrad CPC",
      key: "Amstrad CPC",
    },
    {
      id: 52,
      name: "Arcade",
      key: "Arcade",
    },
    {
      id: 29,
      name: "Sega Mega Drive/Genesis",
      key: "Sega Mega Drive/Genesis",
    },
    {
      id: 59,
      name: "Atari 2600",
      key: "Atari 2600",
    },
    {
      id: 68,
      name: "ColecoVision",
      key: "ColecoVision",
    },
    {
      id: 475,
      name: "R-Zone",
      key: "R-Zone",
    },
    {
      id: 476,
      name: "Apple Pippin",
      key: "Apple Pippin",
    },
    {
      id: 481,
      name: "Tomy Tutor / Pyuta / Grandstand Tutor",
      key: "Tomy Tutor / Pyuta / Grandstand Tutor",
    },
    {
      id: 486,
      name: "Digiblast",
      key: "Digiblast",
    },
    {
      id: 48,
      name: "PlayStation 4",
      key: "PlayStation 4",
    },
    {
      id: 12,
      name: "Xbox 360",
      key: "Xbox 360",
    },
    {
      id: 34,
      name: "Android",
      key: "Android",
    },
    {
      id: 482,
      name: "Sega CD 32X",
      key: "Sega CD 32X",
    },
    {
      id: 49,
      name: "Xbox One",
      key: "Xbox One",
    },
    {
      id: 3,
      name: "Linux",
      key: "Linux",
    },
    {
      id: 4,
      name: "Nintendo 64",
      key: "Nintendo 64",
    },
    {
      id: 55,
      name: "Legacy Mobile Device",
      key: "Legacy Mobile Device",
    },
    {
      id: 5,
      name: "Wii",
      key: "Wii",
    },
    {
      id: 19,
      name: "Super Nintendo Entertainment System",
      key: "Super Nintendo Entertainment System",
    },
    {
      "id": 4,
      "name": "Switch",
      "slug": "switch",
      "key": "Switch",

    },
    {
      id: 39,
      name: "iOS",
      key: "iOS",
    },
    {
      id: 58,
      name: "Super Famicom",
      key: "Super Famicom",
    },
    {
      id: 63,
      name: "Atari ST/STE",
      key: "Atari ST/STE",
    },
    {
      id: 75,
      name: "Apple II",
      key: "Apple II",
    },
    {
      id: 82,
      name: "Web browser",
      key: "Web browser",
    },
    {
      id: 90,
      name: "Commodore PET",
      key: "Commodore PET",
    },
    {
      id: 126,
      name: "TRS-80",
      key: "TRS-80",
    },
    {
      id: 159,
      name: "Nintendo DSi",
      key: "Nintendo DSi",
    },
    {
      id: 487,
      name: "LaserActive",
      key: "LaserActive",
    },
    {
      id: 14,
      name: "Mac",
      key: "Mac",
    },
    {
      id: 373,
      name: "Sinclair ZX81",
      key: "Sinclair ZX81",
    },
    {
      id: 72,
      name: "Ouya",
      key: "Ouya",
    },
    {
      id: 130,
      name: "Nintendo Switch",
      key: "Nintendo Switch",
    },
  ],
  themes: [
    {
      id: 31,
      name: "Drama",
      key: "Drama",
    },
    {
      id: 32,
      name: "Non-fiction",
      key: "Non-fiction",
    },
    {
      id: 33,
      name: "Sandbox",
      key: "Sandbox",
    },
    {
      id: 34,
      name: "Educational",
      key: "Educational",
    },
    {
      id: 35,
      name: "Kids",
      key: "Kids",
    },
    {
      id: 38,
      name: "Open world",
      key: "Open world",
    },
    {
      id: 39,
      name: "Warfare",
      key: "Warfare",
    },
    {
      id: 40,
      name: "Party",
      key: "Party",
    },
    {
      id: 41,
      name: "4X (explore, expand, exploit, and exterminate)",
      key: "4X (explore, expand, exploit, and exterminate)",
    },
    {
      id: 42,
      name: "Erotic",
      key: "Erotic",
    },
    {
      id: 43,
      name: "Mystery",
      key: "Mystery",
    },
    {
      id: 1,
      name: "Action",
      key: "Action",
    },
    {
      id: 17,
      name: "Fantasy",
      key: "Fantasy",
    },
    {
      id: 18,
      name: "Science fiction",
      key: "Science fiction",
    },
    {
      id: 19,
      name: "Horror",
      key: "Horror",
    },
    {
      id: 20,
      name: "Thriller",
      key: "Thriller",
    },
    {
      id: 21,
      name: "Survival",
      key: "Survival",
    },
    {
      id: 22,
      name: "Historical",
      key: "Historical",
    },
    {
      id: 23,
      name: "Stealth",
      key: "Stealth",
    },
    {
      id: 27,
      name: "Comedy",
      key: "Comedy",
    },
    {
      id: 28,
      name: "Business",
      key: "Business",
    },
    {
      id: 44,
      name: "Romance",
      key: "Romance",
    },
  ],
  genre: [
    {
      id: 2,
      name: "Point-and-click",
      key: "Point-and-click",
    },
    {
      id: 4,
      name: "Fighting",
      key: "Fighting",
    },
    {
      id: 5,
      name: "Shooter",
      key: "Shooter",
    },
    {
      id: 7,
      name: "Music",
      key: "Music",
    },
    {
      id: 8,
      name: "Platform",
      key: "Platform",
    },
    {
      id: 9,
      name: "Puzzle",
      key: "Puzzle",
    },
    {
      id: 10,
      name: "Racing",
      key: "Racing",
    },
    {
      id: 11,
      name: "Real Time Strategy (RTS)",
      key: "Real Time Strategy (RTS)",
    },
    {
      id: 12,
      name: "Role-playing (RPG)",
      key: "Role-playing (RPG)",
    },
    {
      id: 13,
      name: "Simulator",
      key: "Simulator",
    },
    {
      id: 14,
      name: "Sport",
      key: "Sport",
    },
    {
      id: 15,
      name: "Strategy",
      key: "Strategy",
    },
    {
      id: 16,
      name: "Turn-based strategy (TBS)",
      key: "Turn-based strategy (TBS)",
    },
    {
      id: 24,
      name: "Tactical",
      key: "Tactical",
    },
    {
      id: 25,
      name: "Hack and slash/Beat 'em up",
      key: "Hack and slash/Beat 'em up",
    },
    {
      id: 26,
      name: "Quiz/Trivia",
      key: "Quiz/Trivia",
    },
    {
      id: 30,
      name: "Pinball",
      key: "Pinball",
    },
    {
      id: 31,
      name: "Adventure",
      key: "Adventure",
    },
    {
      id: 32,
      name: "Indie",
      key: "Indie",
    },
    {
      id: 33,
      name: "Arcade",
      key: "Arcade",
    },
    {
      id: 34,
      name: "Visual Novel",
      key: "Visual Novel",
    },
    {
      id: 35,
      name: "Card & Board Game",
      key: "Card & Board Game",
    },
    {
      id: 36,
      name: "MOBA",
      key: "MOBA",
    },
  ],
  gamemodes: [
    {
      id: 1,
      name: "Single player",
      key: "Single player",
    },
    {
      id: 2,
      name: "Multiplayer",
      key: "Multiplayer",
    },
    {
      id: 3,
      name: "Co-operative",
      key: "Co-operative",
    },
    {
      id: 4,
      name: "Split screen",
      key: "Split screen",
    },
    {
      id: 5,
      name: "Massively Multiplayer Online (MMO)",
      key: "Massively Multiplayer Online (MMO)",
    },
    {
      id: 6,
      name: "Battle Royale",
      key: "Battle Royale",
    },
  ],
  playerperspectives: [
    {
      id: 1,
      name: "First person",
      key: "First person",
    },
    {
      id: 2,
      name: "Third person",
      key: "Third person",
    },
    {
      id: 3,
      name: "Bird view / Isometric",
      key: "Bird view / Isometric",
    },
    {
      id: 4,
      name: "Side view",
      key: "Side view",
    },
    {
      id: 5,
      name: "Text",
      key: "Text",
    },
    {
      id: 6,
      name: "Auditory",
      key: "Auditory",
    },
    {
      id: 7,
      name: "Virtual Reality",
      key: "Virtual Reality",
    },
  ],
  sort: [
    { by: "Title", order: "DESC" },
    { by: "Date", order: "DESC" },
    { by: "Last Played", order: "DESC" },
  ], 
};

export default filterdata;
