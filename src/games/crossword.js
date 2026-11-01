import { SeededRNG } from './prng.js';

const PUZZLE_BANK = {
  "easy": [
    {
      "id": "e1",
      "title": "Golden Meadows I",
      "grid": [
        [
          "A",
          "B",
          "B",
          "O",
          "T"
        ],
        [
          "B",
          "R",
          "I",
          "D",
          "E"
        ],
        [
          "B",
          "I",
          "S",
          "O",
          "N"
        ],
        [
          "O",
          "D",
          "O",
          "R",
          "S"
        ],
        [
          "T",
          "E",
          "N",
          "S",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "ABBOT",
          "clue": "Superior monk or head of a monastery"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "BRIDE",
          "clue": "Woman walking down the wedding aisle"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "BISON",
          "clue": "Humped wild shaggy ox of North America"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "ODORS",
          "clue": "Scents, aromas, and olfactory sensations"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TENSE",
          "clue": "Tense - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "ABBOT",
          "clue": "Superior monk or head of a monastery"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "BRIDE",
          "clue": "Woman walking down the wedding aisle"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "BISON",
          "clue": "Humped wild shaggy ox of North America"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "ODORS",
          "clue": "Scents, aromas, and olfactory sensations"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TENSE",
          "clue": "Tense - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e2",
      "title": "Starlight Orbit I",
      "grid": [
        [
          "A",
          "I",
          "S",
          "L",
          "E"
        ],
        [
          "I",
          "N",
          "T",
          "E",
          "R"
        ],
        [
          "S",
          "T",
          "U",
          "D",
          "Y"
        ],
        [
          "L",
          "E",
          "D",
          "G",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "AISLE",
          "clue": "Passage walkway between rows of seats"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "INTER",
          "clue": "Inter - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "STUDY",
          "clue": "Study - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "LEDGE",
          "clue": "Narrow horizontal shelf on a canyon cliff"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "AISLE",
          "clue": "Passage walkway between rows of seats"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "INTER",
          "clue": "Inter - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "STUDY",
          "clue": "Study - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "LEDGE",
          "clue": "Narrow horizontal shelf on a canyon cliff"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e3",
      "title": "Ocean Breeze I",
      "grid": [
        [
          "A",
          "I",
          "S",
          "L",
          "E"
        ],
        [
          "I",
          "N",
          "T",
          "E",
          "R"
        ],
        [
          "S",
          "T",
          "R",
          "A",
          "Y"
        ],
        [
          "L",
          "E",
          "A",
          "V",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "AISLE",
          "clue": "Passage walkway between rows of seats"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "INTER",
          "clue": "Inter - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "STRAY",
          "clue": "Wander away from familiar path and group"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "LEAVE",
          "clue": "Leave - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "AISLE",
          "clue": "Passage walkway between rows of seats"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "INTER",
          "clue": "Inter - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "STRAY",
          "clue": "Wander away from familiar path and group"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "LEAVE",
          "clue": "Leave - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e4",
      "title": "Springtime Glow I",
      "grid": [
        [
          "A",
          "N",
          "I",
          "M",
          "E"
        ],
        [
          "N",
          "E",
          "V",
          "E",
          "R"
        ],
        [
          "I",
          "V",
          "O",
          "R",
          "Y"
        ],
        [
          "M",
          "E",
          "R",
          "G",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "ANIME",
          "clue": "Distinctive Japanese animation style"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "NEVER",
          "clue": "Never - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "ANIME",
          "clue": "Distinctive Japanese animation style"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "NEVER",
          "clue": "Never - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e5",
      "title": "Mountain Crest I",
      "grid": [
        [
          "A",
          "P",
          "R",
          "I",
          "L"
        ],
        [
          "P",
          "E",
          "A",
          "C",
          "E"
        ],
        [
          "R",
          "A",
          "P",
          "I",
          "D"
        ],
        [
          "I",
          "C",
          "I",
          "N",
          "G"
        ],
        [
          "L",
          "E",
          "D",
          "G",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "APRIL",
          "clue": "Spring month famous for rain showers"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "PEACE",
          "clue": "Freedom from civil disturbance and war"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "RAPID",
          "clue": "Moving with astonishing swift velocity"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "ICING",
          "clue": "Sweet creamy frosting on a birthday cake"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "LEDGE",
          "clue": "Narrow horizontal shelf on a canyon cliff"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "APRIL",
          "clue": "Spring month famous for rain showers"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "PEACE",
          "clue": "Freedom from civil disturbance and war"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "RAPID",
          "clue": "Moving with astonishing swift velocity"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "ICING",
          "clue": "Sweet creamy frosting on a birthday cake"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "LEDGE",
          "clue": "Narrow horizontal shelf on a canyon cliff"
        }
      ]
    },
    {
      "id": "e6",
      "title": "Ancient Forest I",
      "grid": [
        [
          "A",
          "P",
          "R",
          "I",
          "L"
        ],
        [
          "P",
          "L",
          "A",
          "C",
          "E"
        ],
        [
          "R",
          "A",
          "P",
          "I",
          "D"
        ],
        [
          "I",
          "C",
          "I",
          "N",
          "G"
        ],
        [
          "L",
          "E",
          "D",
          "G",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "APRIL",
          "clue": "Spring month famous for rain showers"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "PLACE",
          "clue": "Specific geographical spot or position"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "RAPID",
          "clue": "Moving with astonishing swift velocity"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "ICING",
          "clue": "Sweet creamy frosting on a birthday cake"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "LEDGE",
          "clue": "Narrow horizontal shelf on a canyon cliff"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "APRIL",
          "clue": "Spring month famous for rain showers"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "PLACE",
          "clue": "Specific geographical spot or position"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "RAPID",
          "clue": "Moving with astonishing swift velocity"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "ICING",
          "clue": "Sweet creamy frosting on a birthday cake"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "LEDGE",
          "clue": "Narrow horizontal shelf on a canyon cliff"
        }
      ]
    },
    {
      "id": "e7",
      "title": "Crystal Brook I",
      "grid": [
        [
          "A",
          "P",
          "R",
          "I",
          "L"
        ],
        [
          "P",
          "R",
          "I",
          "C",
          "E"
        ],
        [
          "R",
          "I",
          "G",
          "I",
          "D"
        ],
        [
          "I",
          "C",
          "I",
          "N",
          "G"
        ],
        [
          "L",
          "E",
          "D",
          "G",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "APRIL",
          "clue": "Spring month famous for rain showers"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "PRICE",
          "clue": "Monetary cost required to purchase goods"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "RIGID",
          "clue": "Rigid - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "ICING",
          "clue": "Sweet creamy frosting on a birthday cake"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "LEDGE",
          "clue": "Narrow horizontal shelf on a canyon cliff"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "APRIL",
          "clue": "Spring month famous for rain showers"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "PRICE",
          "clue": "Monetary cost required to purchase goods"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "RIGID",
          "clue": "Rigid - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "ICING",
          "clue": "Sweet creamy frosting on a birthday cake"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "LEDGE",
          "clue": "Narrow horizontal shelf on a canyon cliff"
        }
      ]
    },
    {
      "id": "e8",
      "title": "Midnight Echo I",
      "grid": [
        [
          "A",
          "R",
          "O",
          "S",
          "E"
        ],
        [
          "R",
          "E",
          "L",
          "A",
          "X"
        ],
        [
          "O",
          "L",
          "I",
          "V",
          "E"
        ],
        [
          "S",
          "A",
          "V",
          "O",
          "R"
        ],
        [
          "E",
          "X",
          "E",
          "R",
          "T"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "AROSE",
          "clue": "Ascended upward or came into view"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RELAX",
          "clue": "Release tension and rest in serene tranquility"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "OLIVE",
          "clue": "Savory green Mediterranean fruit on salads"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SAVOR",
          "clue": "Enjoy flavor or cherish meaningful moment"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "EXERT",
          "clue": "Apply vigorous strength or willpower"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "AROSE",
          "clue": "Ascended upward or came into view"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RELAX",
          "clue": "Release tension and rest in serene tranquility"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "OLIVE",
          "clue": "Savory green Mediterranean fruit on salads"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SAVOR",
          "clue": "Enjoy flavor or cherish meaningful moment"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "EXERT",
          "clue": "Apply vigorous strength or willpower"
        }
      ]
    },
    {
      "id": "e9",
      "title": "Sunrise Valley I",
      "grid": [
        [
          "B",
          "A",
          "S",
          "I",
          "C"
        ],
        [
          "A",
          "R",
          "E",
          "N",
          "A"
        ],
        [
          "S",
          "E",
          "R",
          "U",
          "M"
        ],
        [
          "I",
          "N",
          "U",
          "R",
          "E"
        ],
        [
          "C",
          "A",
          "M",
          "E",
          "L"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BASIC",
          "clue": "Fundamental, essential, or elemental"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "ARENA",
          "clue": "Arena - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "SERUM",
          "clue": "Serum - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "CAMEL",
          "clue": "Desert mammal known for its water humps"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BASIC",
          "clue": "Fundamental, essential, or elemental"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "ARENA",
          "clue": "Arena - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "SERUM",
          "clue": "Serum - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "CAMEL",
          "clue": "Desert mammal known for its water humps"
        }
      ]
    },
    {
      "id": "e10",
      "title": "Silver Timber I",
      "grid": [
        [
          "B",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "N",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "e11",
      "title": "Autumn Leaves I",
      "grid": [
        [
          "B",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "N",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e12",
      "title": "Desert Mirage I",
      "grid": [
        [
          "B",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "R",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STORE",
          "clue": "Store - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STORE",
          "clue": "Store - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "e13",
      "title": "River Odyssey I",
      "grid": [
        [
          "B",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "R",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STORE",
          "clue": "Store - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STORE",
          "clue": "Store - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e14",
      "title": "Sapphire Skies I",
      "grid": [
        [
          "B",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "V",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STOVE",
          "clue": "Appliance with hot burners for cooking stew"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STOVE",
          "clue": "Appliance with hot burners for cooking stew"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "e15",
      "title": "Cobblestone Lane I",
      "grid": [
        [
          "B",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "V",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STOVE",
          "clue": "Appliance with hot burners for cooking stew"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STOVE",
          "clue": "Appliance with hot burners for cooking stew"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e16",
      "title": "Emerald Grove I",
      "grid": [
        [
          "B",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "K",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STOKE",
          "clue": "Add fuel chunks to keep boiler fire roaring"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STOKE",
          "clue": "Add fuel chunks to keep boiler fire roaring"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "e17",
      "title": "Thunder Peak I",
      "grid": [
        [
          "B",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "K",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STOKE",
          "clue": "Add fuel chunks to keep boiler fire roaring"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STOKE",
          "clue": "Add fuel chunks to keep boiler fire roaring"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e18",
      "title": "Velvet Twilight I",
      "grid": [
        [
          "B",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "M",
          "B",
          "E",
          "R"
        ],
        [
          "A",
          "B",
          "I",
          "D",
          "E"
        ],
        [
          "S",
          "E",
          "D",
          "A",
          "N"
        ],
        [
          "T",
          "R",
          "E",
          "N",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EMBER",
          "clue": "Glowing coal fragment in dying campfire"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ABIDE",
          "clue": "Tolerate, endure, or remain steadfast"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SEDAN",
          "clue": "Sedan - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EMBER",
          "clue": "Glowing coal fragment in dying campfire"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ABIDE",
          "clue": "Tolerate, endure, or remain steadfast"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SEDAN",
          "clue": "Sedan - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ]
    },
    {
      "id": "e19",
      "title": "Island Harbor I",
      "grid": [
        [
          "B",
          "L",
          "A",
          "N",
          "D"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "R"
        ],
        [
          "A",
          "N",
          "G",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "D",
          "R",
          "Y",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLAND",
          "clue": "Mild and lacking strong seasoning"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ANGRY",
          "clue": "Feeling or expressing intense ire"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLAND",
          "clue": "Mild and lacking strong seasoning"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ANGRY",
          "clue": "Feeling or expressing intense ire"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ]
    },
    {
      "id": "e20",
      "title": "Whispering Pines I",
      "grid": [
        [
          "B",
          "L",
          "A",
          "S",
          "T"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "R"
        ],
        [
          "A",
          "N",
          "O",
          "D",
          "E"
        ],
        [
          "S",
          "E",
          "D",
          "A",
          "N"
        ],
        [
          "T",
          "R",
          "E",
          "N",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLAST",
          "clue": "Sudden powerful gust of explosive wind"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ANODE",
          "clue": "Anode - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SEDAN",
          "clue": "Sedan - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLAST",
          "clue": "Sudden powerful gust of explosive wind"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ANODE",
          "clue": "Anode - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SEDAN",
          "clue": "Sedan - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ]
    },
    {
      "id": "e21",
      "title": "Solar Flares I",
      "grid": [
        [
          "B",
          "L",
          "A",
          "S",
          "T"
        ],
        [
          "L",
          "U",
          "N",
          "A",
          "R"
        ],
        [
          "A",
          "N",
          "G",
          "L",
          "E"
        ],
        [
          "S",
          "A",
          "L",
          "S",
          "A"
        ],
        [
          "T",
          "R",
          "E",
          "A",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLAST",
          "clue": "Sudden powerful gust of explosive wind"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LUNAR",
          "clue": "Relating to earth's silv'ry nighttime moon"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ANGLE",
          "clue": "Space between two intersecting lines"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SALSA",
          "clue": "Salsa - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TREAD",
          "clue": "Tread - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLAST",
          "clue": "Sudden powerful gust of explosive wind"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LUNAR",
          "clue": "Relating to earth's silv'ry nighttime moon"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ANGLE",
          "clue": "Space between two intersecting lines"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SALSA",
          "clue": "Salsa - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TREAD",
          "clue": "Tread - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e22",
      "title": "Mystic Cavern I",
      "grid": [
        [
          "B",
          "L",
          "A",
          "S",
          "T"
        ],
        [
          "L",
          "U",
          "N",
          "A",
          "R"
        ],
        [
          "A",
          "N",
          "K",
          "L",
          "E"
        ],
        [
          "S",
          "A",
          "L",
          "S",
          "A"
        ],
        [
          "T",
          "R",
          "E",
          "A",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLAST",
          "clue": "Sudden powerful gust of explosive wind"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LUNAR",
          "clue": "Relating to earth's silv'ry nighttime moon"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ANKLE",
          "clue": "Joint connecting foot and lower leg"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SALSA",
          "clue": "Salsa - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TREAD",
          "clue": "Tread - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLAST",
          "clue": "Sudden powerful gust of explosive wind"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LUNAR",
          "clue": "Relating to earth's silv'ry nighttime moon"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ANKLE",
          "clue": "Joint connecting foot and lower leg"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SALSA",
          "clue": "Salsa - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TREAD",
          "clue": "Tread - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e23",
      "title": "Alpine Haven I",
      "grid": [
        [
          "B",
          "L",
          "E",
          "N",
          "D"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "R"
        ],
        [
          "E",
          "N",
          "T",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "D",
          "R",
          "Y",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLEND",
          "clue": "Harmoniously combine into a mixture"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ENTRY",
          "clue": "Entry - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLEND",
          "clue": "Harmoniously combine into a mixture"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ENTRY",
          "clue": "Entry - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ]
    },
    {
      "id": "e24",
      "title": "Radiant Horizon I",
      "grid": [
        [
          "B",
          "L",
          "E",
          "N",
          "D"
        ],
        [
          "L",
          "I",
          "V",
          "E",
          "R"
        ],
        [
          "E",
          "V",
          "E",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "D",
          "R",
          "Y",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLEND",
          "clue": "Harmoniously combine into a mixture"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LIVER",
          "clue": "Liver - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "EVERY",
          "clue": "All members of a category without lack"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLEND",
          "clue": "Harmoniously combine into a mixture"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LIVER",
          "clue": "Liver - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "EVERY",
          "clue": "All members of a category without lack"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ]
    },
    {
      "id": "e25",
      "title": "Lunar Eclipse I",
      "grid": [
        [
          "B",
          "L",
          "E",
          "N",
          "D"
        ],
        [
          "L",
          "O",
          "V",
          "E",
          "R"
        ],
        [
          "E",
          "V",
          "E",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "D",
          "R",
          "Y",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLEND",
          "clue": "Harmoniously combine into a mixture"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LOVER",
          "clue": "Lover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "EVERY",
          "clue": "All members of a category without lack"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLEND",
          "clue": "Harmoniously combine into a mixture"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LOVER",
          "clue": "Lover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "EVERY",
          "clue": "All members of a category without lack"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ]
    },
    {
      "id": "e26",
      "title": "Harbor Lights I",
      "grid": [
        [
          "B",
          "L",
          "I",
          "N",
          "D"
        ],
        [
          "L",
          "I",
          "V",
          "E",
          "R"
        ],
        [
          "I",
          "V",
          "O",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "D",
          "R",
          "Y",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLIND",
          "clue": "Unable to see or window shade covering"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LIVER",
          "clue": "Liver - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLIND",
          "clue": "Unable to see or window shade covering"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LIVER",
          "clue": "Liver - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ]
    },
    {
      "id": "e27",
      "title": "Silent Meadow I",
      "grid": [
        [
          "B",
          "L",
          "I",
          "N",
          "D"
        ],
        [
          "L",
          "O",
          "V",
          "E",
          "R"
        ],
        [
          "I",
          "V",
          "O",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "D",
          "R",
          "Y",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLIND",
          "clue": "Unable to see or window shade covering"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LOVER",
          "clue": "Lover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLIND",
          "clue": "Unable to see or window shade covering"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LOVER",
          "clue": "Lover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ]
    },
    {
      "id": "e28",
      "title": "Timber Ridge I",
      "grid": [
        [
          "B",
          "L",
          "I",
          "N",
          "K"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "N"
        ],
        [
          "I",
          "N",
          "U",
          "R",
          "E"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "K",
          "N",
          "E",
          "E",
          "L"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLINK",
          "clue": "Rapidly close and open both eyes"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINEN",
          "clue": "Crisp woven textile spun from flax fibers"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "KNEEL",
          "clue": "Kneel - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLINK",
          "clue": "Rapidly close and open both eyes"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINEN",
          "clue": "Crisp woven textile spun from flax fibers"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "KNEEL",
          "clue": "Kneel - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e29",
      "title": "Citrus Grove I",
      "grid": [
        [
          "B",
          "L",
          "I",
          "S",
          "S"
        ],
        [
          "L",
          "I",
          "G",
          "H",
          "T"
        ],
        [
          "I",
          "G",
          "L",
          "O",
          "O"
        ],
        [
          "S",
          "H",
          "O",
          "W",
          "N"
        ],
        [
          "S",
          "T",
          "O",
          "N",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLISS",
          "clue": "State of absolute supreme happiness"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LIGHT",
          "clue": "Electromagnetic radiance illuminating dark"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "IGLOO",
          "clue": "Dome-shaped winter shelter constructed from snow"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SHOWN",
          "clue": "Shown - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BLISS",
          "clue": "State of absolute supreme happiness"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LIGHT",
          "clue": "Electromagnetic radiance illuminating dark"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "IGLOO",
          "clue": "Dome-shaped winter shelter constructed from snow"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SHOWN",
          "clue": "Shown - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        }
      ]
    },
    {
      "id": "e30",
      "title": "Northern Lights I",
      "grid": [
        [
          "B",
          "R",
          "I",
          "N",
          "E"
        ],
        [
          "R",
          "I",
          "V",
          "E",
          "R"
        ],
        [
          "I",
          "V",
          "O",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BRINE",
          "clue": "Highly concentrated salty seawater soak"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RIVER",
          "clue": "Vast freshwater flow winding toward the sea"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BRINE",
          "clue": "Highly concentrated salty seawater soak"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RIVER",
          "clue": "Vast freshwater flow winding toward the sea"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e31",
      "title": "Rustic Cabin I",
      "grid": [
        [
          "B",
          "R",
          "I",
          "N",
          "E"
        ],
        [
          "R",
          "O",
          "V",
          "E",
          "R"
        ],
        [
          "I",
          "V",
          "O",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BRINE",
          "clue": "Highly concentrated salty seawater soak"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "ROVER",
          "clue": "Rover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "BRINE",
          "clue": "Highly concentrated salty seawater soak"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "ROVER",
          "clue": "Rover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e32",
      "title": "Breezy Point I",
      "grid": [
        [
          "C",
          "A",
          "R",
          "G",
          "O"
        ],
        [
          "A",
          "L",
          "E",
          "R",
          "T"
        ],
        [
          "R",
          "E",
          "P",
          "O",
          "T"
        ],
        [
          "G",
          "R",
          "O",
          "P",
          "E"
        ],
        [
          "O",
          "T",
          "T",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CARGO",
          "clue": "Freight goods shipped on ocean liners"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "ALERT",
          "clue": "Vigilant, attentive, and fully awake"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "REPOT",
          "clue": "Repot - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "GROPE",
          "clue": "Grope - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "OTTER",
          "clue": "Otter - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CARGO",
          "clue": "Freight goods shipped on ocean liners"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "ALERT",
          "clue": "Vigilant, attentive, and fully awake"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "REPOT",
          "clue": "Repot - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "GROPE",
          "clue": "Grope - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "OTTER",
          "clue": "Otter - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e33",
      "title": "Twilight Shadows I",
      "grid": [
        [
          "C",
          "H",
          "A",
          "O",
          "S"
        ],
        [
          "H",
          "A",
          "U",
          "N",
          "T"
        ],
        [
          "A",
          "U",
          "D",
          "I",
          "O"
        ],
        [
          "O",
          "N",
          "I",
          "O",
          "N"
        ],
        [
          "S",
          "T",
          "O",
          "N",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CHAOS",
          "clue": "Utter confusion and disordered disarray"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "HAUNT",
          "clue": "Frequent ghostlike presence in old castle"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AUDIO",
          "clue": "Sound reproduction and acoustic recording"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "ONION",
          "clue": "Onion - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CHAOS",
          "clue": "Utter confusion and disordered disarray"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "HAUNT",
          "clue": "Frequent ghostlike presence in old castle"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AUDIO",
          "clue": "Sound reproduction and acoustic recording"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "ONION",
          "clue": "Onion - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        }
      ]
    },
    {
      "id": "e34",
      "title": "Sunken Reef I",
      "grid": [
        [
          "C",
          "H",
          "A",
          "S",
          "E"
        ],
        [
          "H",
          "A",
          "V",
          "E",
          "N"
        ],
        [
          "A",
          "V",
          "O",
          "I",
          "D"
        ],
        [
          "S",
          "E",
          "I",
          "Z",
          "E"
        ],
        [
          "E",
          "N",
          "D",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CHASE",
          "clue": "Pursue rapidly in an energetic sprint"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "HAVEN",
          "clue": "Place of safe harbor, refuge, and calm"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AVOID",
          "clue": "Stay away from or prevent happening"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SEIZE",
          "clue": "Seize - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ENDED",
          "clue": "Reached the final concluding curtain drop"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CHASE",
          "clue": "Pursue rapidly in an energetic sprint"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "HAVEN",
          "clue": "Place of safe harbor, refuge, and calm"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AVOID",
          "clue": "Stay away from or prevent happening"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SEIZE",
          "clue": "Seize - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ENDED",
          "clue": "Reached the final concluding curtain drop"
        }
      ]
    },
    {
      "id": "e35",
      "title": "Glacial Peaks I",
      "grid": [
        [
          "C",
          "L",
          "A",
          "S",
          "P"
        ],
        [
          "L",
          "E",
          "G",
          "A",
          "L"
        ],
        [
          "A",
          "G",
          "I",
          "L",
          "E"
        ],
        [
          "S",
          "A",
          "L",
          "S",
          "A"
        ],
        [
          "P",
          "L",
          "E",
          "A",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLASP",
          "clue": "Fasten securely with a mechanical latch"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SALSA",
          "clue": "Salsa - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "PLEAD",
          "clue": "Plead - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLASP",
          "clue": "Fasten securely with a mechanical latch"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SALSA",
          "clue": "Salsa - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "PLEAD",
          "clue": "Plead - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e36",
      "title": "Orchard Path I",
      "grid": [
        [
          "C",
          "L",
          "A",
          "S",
          "S"
        ],
        [
          "L",
          "E",
          "G",
          "A",
          "L"
        ],
        [
          "A",
          "G",
          "I",
          "L",
          "E"
        ],
        [
          "S",
          "A",
          "L",
          "V",
          "E"
        ],
        [
          "S",
          "L",
          "E",
          "E",
          "K"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLASS",
          "clue": "Category of students or social elegance"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SALVE",
          "clue": "Salve - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "SLEEK",
          "clue": "Sleek - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLASS",
          "clue": "Category of students or social elegance"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SALVE",
          "clue": "Salve - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "SLEEK",
          "clue": "Sleek - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "e37",
      "title": "Azure Lagoon I",
      "grid": [
        [
          "C",
          "L",
          "A",
          "S",
          "S"
        ],
        [
          "L",
          "E",
          "G",
          "A",
          "L"
        ],
        [
          "A",
          "G",
          "I",
          "L",
          "E"
        ],
        [
          "S",
          "A",
          "L",
          "V",
          "E"
        ],
        [
          "S",
          "L",
          "E",
          "E",
          "T"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLASS",
          "clue": "Category of students or social elegance"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SALVE",
          "clue": "Salve - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "SLEET",
          "clue": "Chilly freezing rain pellets falling winter"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLASS",
          "clue": "Category of students or social elegance"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SALVE",
          "clue": "Salve - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "SLEET",
          "clue": "Chilly freezing rain pellets falling winter"
        }
      ]
    },
    {
      "id": "e38",
      "title": "Winding Stream I",
      "grid": [
        [
          "C",
          "L",
          "A",
          "S",
          "S"
        ],
        [
          "L",
          "E",
          "G",
          "A",
          "L"
        ],
        [
          "A",
          "G",
          "I",
          "L",
          "E"
        ],
        [
          "S",
          "A",
          "L",
          "V",
          "E"
        ],
        [
          "S",
          "L",
          "E",
          "E",
          "P"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLASS",
          "clue": "Category of students or social elegance"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SALVE",
          "clue": "Salve - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "SLEEP",
          "clue": "Periodic natural state of restful slumber"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLASS",
          "clue": "Category of students or social elegance"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SALVE",
          "clue": "Salve - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "SLEEP",
          "clue": "Periodic natural state of restful slumber"
        }
      ]
    },
    {
      "id": "e39",
      "title": "Starry Night I",
      "grid": [
        [
          "C",
          "L",
          "A",
          "W",
          "S"
        ],
        [
          "L",
          "I",
          "G",
          "H",
          "T"
        ],
        [
          "A",
          "G",
          "R",
          "E",
          "E"
        ],
        [
          "W",
          "H",
          "E",
          "R",
          "E"
        ],
        [
          "S",
          "T",
          "E",
          "E",
          "L"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLAWS",
          "clue": "Claws - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LIGHT",
          "clue": "Electromagnetic radiance illuminating dark"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AGREE",
          "clue": "Concur or share the identical opinion"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "WHERE",
          "clue": "Where - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "STEEL",
          "clue": "Strong resilient alloy of iron and carbon"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLAWS",
          "clue": "Claws - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LIGHT",
          "clue": "Electromagnetic radiance illuminating dark"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AGREE",
          "clue": "Concur or share the identical opinion"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "WHERE",
          "clue": "Where - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "STEEL",
          "clue": "Strong resilient alloy of iron and carbon"
        }
      ]
    },
    {
      "id": "e40",
      "title": "Hearth & Home I",
      "grid": [
        [
          "C",
          "L",
          "A",
          "W",
          "S"
        ],
        [
          "L",
          "I",
          "G",
          "H",
          "T"
        ],
        [
          "A",
          "G",
          "R",
          "E",
          "E"
        ],
        [
          "W",
          "H",
          "E",
          "R",
          "E"
        ],
        [
          "S",
          "T",
          "E",
          "E",
          "P"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLAWS",
          "clue": "Claws - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LIGHT",
          "clue": "Electromagnetic radiance illuminating dark"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AGREE",
          "clue": "Concur or share the identical opinion"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "WHERE",
          "clue": "Where - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "STEEP",
          "clue": "Steep - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLAWS",
          "clue": "Claws - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LIGHT",
          "clue": "Electromagnetic radiance illuminating dark"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AGREE",
          "clue": "Concur or share the identical opinion"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "WHERE",
          "clue": "Where - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "STEEP",
          "clue": "Steep - 5-letter deduction word"
        }
      ]
    }
  ],
  "medium": [
    {
      "id": "m41",
      "title": "Golden Meadows II",
      "grid": [
        [
          "C",
          "L",
          "A",
          "W",
          "S"
        ],
        [
          "L",
          "I",
          "G",
          "H",
          "T"
        ],
        [
          "A",
          "G",
          "R",
          "E",
          "E"
        ],
        [
          "W",
          "H",
          "E",
          "R",
          "E"
        ],
        [
          "S",
          "T",
          "E",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLAWS",
          "clue": "Claws - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LIGHT",
          "clue": "Electromagnetic radiance illuminating dark"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AGREE",
          "clue": "Concur or share the identical opinion"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "WHERE",
          "clue": "Where - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "STEER",
          "clue": "Guide navigation wheel of automobile"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLAWS",
          "clue": "Claws - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LIGHT",
          "clue": "Electromagnetic radiance illuminating dark"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AGREE",
          "clue": "Concur or share the identical opinion"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "WHERE",
          "clue": "Where - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "STEER",
          "clue": "Guide navigation wheel of automobile"
        }
      ]
    },
    {
      "id": "m42",
      "title": "Starlight Orbit II",
      "grid": [
        [
          "C",
          "L",
          "A",
          "W",
          "S"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "N"
        ],
        [
          "A",
          "N",
          "O",
          "D",
          "E"
        ],
        [
          "W",
          "E",
          "D",
          "G",
          "E"
        ],
        [
          "S",
          "N",
          "E",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLAWS",
          "clue": "Claws - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINEN",
          "clue": "Crisp woven textile spun from flax fibers"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ANODE",
          "clue": "Anode - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "WEDGE",
          "clue": "Wedge - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "SNEER",
          "clue": "Sneer - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLAWS",
          "clue": "Claws - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINEN",
          "clue": "Crisp woven textile spun from flax fibers"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ANODE",
          "clue": "Anode - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "WEDGE",
          "clue": "Wedge - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "SNEER",
          "clue": "Sneer - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "m43",
      "title": "Ocean Breeze II",
      "grid": [
        [
          "C",
          "L",
          "I",
          "M",
          "B"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "R"
        ],
        [
          "I",
          "N",
          "U",
          "R",
          "E"
        ],
        [
          "M",
          "E",
          "R",
          "G",
          "E"
        ],
        [
          "B",
          "R",
          "E",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLIMB",
          "clue": "Ascend rugged mountain peak via trails"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "BREED",
          "clue": "Specific strain of domesticated pet"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLIMB",
          "clue": "Ascend rugged mountain peak via trails"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "BREED",
          "clue": "Specific strain of domesticated pet"
        }
      ]
    },
    {
      "id": "m44",
      "title": "Springtime Glow II",
      "grid": [
        [
          "C",
          "L",
          "I",
          "N",
          "G"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "R"
        ],
        [
          "I",
          "N",
          "U",
          "R",
          "E"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "G",
          "R",
          "E",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLING",
          "clue": "Cling - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "GREED",
          "clue": "Excessive insatiable desire for wealth"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLING",
          "clue": "Cling - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "GREED",
          "clue": "Excessive insatiable desire for wealth"
        }
      ]
    },
    {
      "id": "m45",
      "title": "Mountain Crest II",
      "grid": [
        [
          "C",
          "L",
          "I",
          "N",
          "G"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "R"
        ],
        [
          "I",
          "N",
          "U",
          "R",
          "E"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "G",
          "R",
          "E",
          "E",
          "T"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLING",
          "clue": "Cling - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "GREET",
          "clue": "Welcome someone with a warm handshake"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CLING",
          "clue": "Cling - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "GREET",
          "clue": "Welcome someone with a warm handshake"
        }
      ]
    },
    {
      "id": "m46",
      "title": "Ancient Forest II",
      "grid": [
        [
          "C",
          "O",
          "A",
          "S",
          "T"
        ],
        [
          "O",
          "R",
          "B",
          "I",
          "T"
        ],
        [
          "A",
          "B",
          "A",
          "T",
          "E"
        ],
        [
          "S",
          "I",
          "T",
          "E",
          "S"
        ],
        [
          "T",
          "T",
          "E",
          "S",
          "T"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "COAST",
          "clue": "Shoreline border where land meets water"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "ORBIT",
          "clue": "Curved path of celestial satellite around sun"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ABATE",
          "clue": "Abate - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SITES",
          "clue": "Locations across the World Wide Web network"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TTEST",
          "clue": "Statistical assessment comparing data samples"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "COAST",
          "clue": "Shoreline border where land meets water"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "ORBIT",
          "clue": "Curved path of celestial satellite around sun"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ABATE",
          "clue": "Abate - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SITES",
          "clue": "Locations across the World Wide Web network"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TTEST",
          "clue": "Statistical assessment comparing data samples"
        }
      ]
    },
    {
      "id": "m47",
      "title": "Crystal Brook II",
      "grid": [
        [
          "C",
          "O",
          "B",
          "R",
          "A"
        ],
        [
          "O",
          "C",
          "E",
          "A",
          "N"
        ],
        [
          "B",
          "E",
          "I",
          "N",
          "G"
        ],
        [
          "R",
          "A",
          "N",
          "G",
          "E"
        ],
        [
          "A",
          "N",
          "G",
          "E",
          "L"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "COBRA",
          "clue": "Venomous hooded snake of the jungle"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "OCEAN",
          "clue": "Immense body of saltwater covering earth"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "BEING",
          "clue": "Existence or living sentient entity"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "RANGE",
          "clue": "Range - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ANGEL",
          "clue": "Celestial winged messenger of grace"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "COBRA",
          "clue": "Venomous hooded snake of the jungle"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "OCEAN",
          "clue": "Immense body of saltwater covering earth"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "BEING",
          "clue": "Existence or living sentient entity"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "RANGE",
          "clue": "Range - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ANGEL",
          "clue": "Celestial winged messenger of grace"
        }
      ]
    },
    {
      "id": "m48",
      "title": "Midnight Echo II",
      "grid": [
        [
          "C",
          "O",
          "B",
          "R",
          "A"
        ],
        [
          "O",
          "C",
          "E",
          "A",
          "N"
        ],
        [
          "B",
          "E",
          "I",
          "N",
          "G"
        ],
        [
          "R",
          "A",
          "N",
          "G",
          "E"
        ],
        [
          "A",
          "N",
          "G",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "COBRA",
          "clue": "Venomous hooded snake of the jungle"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "OCEAN",
          "clue": "Immense body of saltwater covering earth"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "BEING",
          "clue": "Existence or living sentient entity"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "RANGE",
          "clue": "Range - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ANGER",
          "clue": "Strong passionate displeasure or fury"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "COBRA",
          "clue": "Venomous hooded snake of the jungle"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "OCEAN",
          "clue": "Immense body of saltwater covering earth"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "BEING",
          "clue": "Existence or living sentient entity"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "RANGE",
          "clue": "Range - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ANGER",
          "clue": "Strong passionate displeasure or fury"
        }
      ]
    },
    {
      "id": "m49",
      "title": "Sunrise Valley II",
      "grid": [
        [
          "C",
          "O",
          "R",
          "A",
          "L"
        ],
        [
          "O",
          "P",
          "E",
          "R",
          "A"
        ],
        [
          "R",
          "E",
          "P",
          "O",
          "T"
        ],
        [
          "A",
          "R",
          "O",
          "S",
          "E"
        ],
        [
          "L",
          "A",
          "T",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CORAL",
          "clue": "Marine invertebrate forming vibrant reefs"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "OPERA",
          "clue": "Staged theatrical drama set entirely to song"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "REPOT",
          "clue": "Repot - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "AROSE",
          "clue": "Ascended upward or came into view"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "LATER",
          "clue": "At a subsequent period in the afternoon"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CORAL",
          "clue": "Marine invertebrate forming vibrant reefs"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "OPERA",
          "clue": "Staged theatrical drama set entirely to song"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "REPOT",
          "clue": "Repot - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "AROSE",
          "clue": "Ascended upward or came into view"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "LATER",
          "clue": "At a subsequent period in the afternoon"
        }
      ]
    },
    {
      "id": "m50",
      "title": "Silver Timber II",
      "grid": [
        [
          "C",
          "R",
          "E",
          "S",
          "T"
        ],
        [
          "R",
          "A",
          "N",
          "C",
          "H"
        ],
        [
          "E",
          "N",
          "T",
          "E",
          "R"
        ],
        [
          "S",
          "C",
          "E",
          "N",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CREST",
          "clue": "Highest ridge peak of a breaking wave"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RANCH",
          "clue": "Ranch - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ENTER",
          "clue": "Step inside through the open threshold"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SCENE",
          "clue": "Visual backdrop or division of theatrical play"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CREST",
          "clue": "Highest ridge peak of a breaking wave"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RANCH",
          "clue": "Ranch - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ENTER",
          "clue": "Step inside through the open threshold"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SCENE",
          "clue": "Visual backdrop or division of theatrical play"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "m51",
      "title": "Autumn Leaves II",
      "grid": [
        [
          "C",
          "R",
          "E",
          "S",
          "T"
        ],
        [
          "R",
          "A",
          "N",
          "C",
          "H"
        ],
        [
          "E",
          "N",
          "T",
          "E",
          "R"
        ],
        [
          "S",
          "C",
          "E",
          "N",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CREST",
          "clue": "Highest ridge peak of a breaking wave"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RANCH",
          "clue": "Ranch - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ENTER",
          "clue": "Step inside through the open threshold"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SCENE",
          "clue": "Visual backdrop or division of theatrical play"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CREST",
          "clue": "Highest ridge peak of a breaking wave"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RANCH",
          "clue": "Ranch - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ENTER",
          "clue": "Step inside through the open threshold"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SCENE",
          "clue": "Visual backdrop or division of theatrical play"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "m52",
      "title": "Desert Mirage II",
      "grid": [
        [
          "C",
          "R",
          "E",
          "S",
          "T"
        ],
        [
          "R",
          "I",
          "V",
          "E",
          "R"
        ],
        [
          "E",
          "V",
          "A",
          "D",
          "E"
        ],
        [
          "S",
          "E",
          "D",
          "A",
          "N"
        ],
        [
          "T",
          "R",
          "E",
          "N",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CREST",
          "clue": "Highest ridge peak of a breaking wave"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RIVER",
          "clue": "Vast freshwater flow winding toward the sea"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "EVADE",
          "clue": "Skillfully escape or slip away from peril"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SEDAN",
          "clue": "Sedan - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CREST",
          "clue": "Highest ridge peak of a breaking wave"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RIVER",
          "clue": "Vast freshwater flow winding toward the sea"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "EVADE",
          "clue": "Skillfully escape or slip away from peril"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SEDAN",
          "clue": "Sedan - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ]
    },
    {
      "id": "m53",
      "title": "River Odyssey II",
      "grid": [
        [
          "C",
          "R",
          "E",
          "S",
          "T"
        ],
        [
          "R",
          "O",
          "V",
          "E",
          "R"
        ],
        [
          "E",
          "V",
          "A",
          "D",
          "E"
        ],
        [
          "S",
          "E",
          "D",
          "A",
          "N"
        ],
        [
          "T",
          "R",
          "E",
          "N",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CREST",
          "clue": "Highest ridge peak of a breaking wave"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "ROVER",
          "clue": "Rover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "EVADE",
          "clue": "Skillfully escape or slip away from peril"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SEDAN",
          "clue": "Sedan - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CREST",
          "clue": "Highest ridge peak of a breaking wave"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "ROVER",
          "clue": "Rover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "EVADE",
          "clue": "Skillfully escape or slip away from peril"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SEDAN",
          "clue": "Sedan - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ]
    },
    {
      "id": "m54",
      "title": "Sapphire Skies II",
      "grid": [
        [
          "C",
          "R",
          "U",
          "S",
          "T"
        ],
        [
          "R",
          "A",
          "N",
          "C",
          "H"
        ],
        [
          "U",
          "N",
          "D",
          "E",
          "R"
        ],
        [
          "S",
          "C",
          "E",
          "N",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CRUST",
          "clue": "Golden outer layer on fresh sourdough"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RANCH",
          "clue": "Ranch - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "UNDER",
          "clue": "Under - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SCENE",
          "clue": "Visual backdrop or division of theatrical play"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CRUST",
          "clue": "Golden outer layer on fresh sourdough"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RANCH",
          "clue": "Ranch - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "UNDER",
          "clue": "Under - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SCENE",
          "clue": "Visual backdrop or division of theatrical play"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "m55",
      "title": "Cobblestone Lane II",
      "grid": [
        [
          "C",
          "R",
          "U",
          "S",
          "T"
        ],
        [
          "R",
          "A",
          "N",
          "C",
          "H"
        ],
        [
          "U",
          "N",
          "D",
          "E",
          "R"
        ],
        [
          "S",
          "C",
          "E",
          "N",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CRUST",
          "clue": "Golden outer layer on fresh sourdough"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RANCH",
          "clue": "Ranch - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "UNDER",
          "clue": "Under - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SCENE",
          "clue": "Visual backdrop or division of theatrical play"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CRUST",
          "clue": "Golden outer layer on fresh sourdough"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RANCH",
          "clue": "Ranch - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "UNDER",
          "clue": "Under - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SCENE",
          "clue": "Visual backdrop or division of theatrical play"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "m56",
      "title": "Emerald Grove II",
      "grid": [
        [
          "C",
          "R",
          "U",
          "S",
          "T"
        ],
        [
          "R",
          "U",
          "L",
          "E",
          "R"
        ],
        [
          "U",
          "L",
          "T",
          "R",
          "A"
        ],
        [
          "S",
          "E",
          "R",
          "U",
          "M"
        ],
        [
          "T",
          "R",
          "A",
          "M",
          "P"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CRUST",
          "clue": "Golden outer layer on fresh sourdough"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RULER",
          "clue": "Ruler - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ULTRA",
          "clue": "Ultra - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SERUM",
          "clue": "Serum - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TRAMP",
          "clue": "Tramp - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "CRUST",
          "clue": "Golden outer layer on fresh sourdough"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RULER",
          "clue": "Ruler - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ULTRA",
          "clue": "Ultra - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SERUM",
          "clue": "Serum - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TRAMP",
          "clue": "Tramp - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "m57",
      "title": "Thunder Peak II",
      "grid": [
        [
          "D",
          "I",
          "S",
          "C",
          "O"
        ],
        [
          "I",
          "N",
          "T",
          "E",
          "R"
        ],
        [
          "S",
          "T",
          "E",
          "A",
          "D"
        ],
        [
          "C",
          "E",
          "A",
          "S",
          "E"
        ],
        [
          "O",
          "R",
          "D",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "DISCO",
          "clue": "Glittering nightclub playing dance beats"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "INTER",
          "clue": "Inter - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "STEAD",
          "clue": "Stead - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "CEASE",
          "clue": "Cease - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ORDER",
          "clue": "Order - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "DISCO",
          "clue": "Glittering nightclub playing dance beats"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "INTER",
          "clue": "Inter - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "STEAD",
          "clue": "Stead - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "CEASE",
          "clue": "Cease - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ORDER",
          "clue": "Order - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "m58",
      "title": "Velvet Twilight II",
      "grid": [
        [
          "D",
          "R",
          "A",
          "M",
          "A"
        ],
        [
          "R",
          "E",
          "P",
          "E",
          "L"
        ],
        [
          "A",
          "P",
          "A",
          "R",
          "T"
        ],
        [
          "M",
          "E",
          "R",
          "G",
          "E"
        ],
        [
          "A",
          "L",
          "T",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "DRAMA",
          "clue": "Compelling theatrical stage performance"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "REPEL",
          "clue": "Repel - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "APART",
          "clue": "Separated by distance or time"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ALTER",
          "clue": "Modify, reshape, or change slightly"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "DRAMA",
          "clue": "Compelling theatrical stage performance"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "REPEL",
          "clue": "Repel - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "APART",
          "clue": "Separated by distance or time"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ALTER",
          "clue": "Modify, reshape, or change slightly"
        }
      ]
    },
    {
      "id": "m59",
      "title": "Island Harbor II",
      "grid": [
        [
          "D",
          "R",
          "A",
          "M",
          "A"
        ],
        [
          "R",
          "U",
          "L",
          "E",
          "R"
        ],
        [
          "A",
          "L",
          "A",
          "R",
          "M"
        ],
        [
          "M",
          "E",
          "R",
          "G",
          "E"
        ],
        [
          "A",
          "R",
          "M",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "DRAMA",
          "clue": "Compelling theatrical stage performance"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RULER",
          "clue": "Ruler - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ALARM",
          "clue": "Warning sound signaling sudden danger"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ARMED",
          "clue": "Equipped with protective weapons"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "DRAMA",
          "clue": "Compelling theatrical stage performance"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RULER",
          "clue": "Ruler - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ALARM",
          "clue": "Warning sound signaling sudden danger"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ARMED",
          "clue": "Equipped with protective weapons"
        }
      ]
    },
    {
      "id": "m60",
      "title": "Whispering Pines II",
      "grid": [
        [
          "D",
          "R",
          "A",
          "P",
          "E"
        ],
        [
          "R",
          "U",
          "L",
          "E",
          "R"
        ],
        [
          "A",
          "L",
          "L",
          "A",
          "Y"
        ],
        [
          "P",
          "E",
          "A",
          "C",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "DRAPE",
          "clue": "Hang or arrange cloth in graceful folds"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RULER",
          "clue": "Ruler - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ALLAY",
          "clue": "Diminish fear, anxiety, or suspicion"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "PEACE",
          "clue": "Freedom from civil disturbance and war"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "DRAPE",
          "clue": "Hang or arrange cloth in graceful folds"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RULER",
          "clue": "Ruler - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ALLAY",
          "clue": "Diminish fear, anxiety, or suspicion"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "PEACE",
          "clue": "Freedom from civil disturbance and war"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "m61",
      "title": "Solar Flares II",
      "grid": [
        [
          "E",
          "S",
          "S",
          "A",
          "Y"
        ],
        [
          "S",
          "H",
          "I",
          "R",
          "E"
        ],
        [
          "S",
          "I",
          "G",
          "M",
          "A"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "Y",
          "E",
          "A",
          "R",
          "N"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "ESSAY",
          "clue": "Structured analytical piece of prose"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "SHIRE",
          "clue": "Traditional administrative county in Britain"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "SIGMA",
          "clue": "Sigma - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "YEARN",
          "clue": "Yearn - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "ESSAY",
          "clue": "Structured analytical piece of prose"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "SHIRE",
          "clue": "Traditional administrative county in Britain"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "SIGMA",
          "clue": "Sigma - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "YEARN",
          "clue": "Yearn - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "m62",
      "title": "Mystic Cavern II",
      "grid": [
        [
          "F",
          "A",
          "L",
          "S",
          "E"
        ],
        [
          "A",
          "R",
          "O",
          "M",
          "A"
        ],
        [
          "L",
          "O",
          "V",
          "E",
          "R"
        ],
        [
          "S",
          "M",
          "E",
          "L",
          "L"
        ],
        [
          "E",
          "A",
          "R",
          "L",
          "Y"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FALSE",
          "clue": "Untrue or contrary to established fact"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "AROMA",
          "clue": "Pleasant and distinctive fragrant scent"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "LOVER",
          "clue": "Lover - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SMELL",
          "clue": "Smell - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "EARLY",
          "clue": "Arriving before appointed scheduled hour"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FALSE",
          "clue": "Untrue or contrary to established fact"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "AROMA",
          "clue": "Pleasant and distinctive fragrant scent"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "LOVER",
          "clue": "Lover - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SMELL",
          "clue": "Smell - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "EARLY",
          "clue": "Arriving before appointed scheduled hour"
        }
      ]
    },
    {
      "id": "m63",
      "title": "Alpine Haven II",
      "grid": [
        [
          "F",
          "A",
          "L",
          "S",
          "E"
        ],
        [
          "A",
          "R",
          "O",
          "M",
          "A"
        ],
        [
          "L",
          "O",
          "V",
          "E",
          "R"
        ],
        [
          "S",
          "M",
          "E",
          "L",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FALSE",
          "clue": "Untrue or contrary to established fact"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "AROMA",
          "clue": "Pleasant and distinctive fragrant scent"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "LOVER",
          "clue": "Lover - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SMELT",
          "clue": "Smelt - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FALSE",
          "clue": "Untrue or contrary to established fact"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "AROMA",
          "clue": "Pleasant and distinctive fragrant scent"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "LOVER",
          "clue": "Lover - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SMELT",
          "clue": "Smelt - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        }
      ]
    },
    {
      "id": "m64",
      "title": "Radiant Horizon II",
      "grid": [
        [
          "F",
          "A",
          "L",
          "S",
          "E"
        ],
        [
          "A",
          "R",
          "O",
          "M",
          "A"
        ],
        [
          "L",
          "O",
          "W",
          "E",
          "R"
        ],
        [
          "S",
          "M",
          "E",
          "L",
          "L"
        ],
        [
          "E",
          "A",
          "R",
          "L",
          "Y"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FALSE",
          "clue": "Untrue or contrary to established fact"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "AROMA",
          "clue": "Pleasant and distinctive fragrant scent"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "LOWER",
          "clue": "Reduce in altitude, volume, or placement"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SMELL",
          "clue": "Smell - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "EARLY",
          "clue": "Arriving before appointed scheduled hour"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FALSE",
          "clue": "Untrue or contrary to established fact"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "AROMA",
          "clue": "Pleasant and distinctive fragrant scent"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "LOWER",
          "clue": "Reduce in altitude, volume, or placement"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SMELL",
          "clue": "Smell - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "EARLY",
          "clue": "Arriving before appointed scheduled hour"
        }
      ]
    },
    {
      "id": "m65",
      "title": "Lunar Eclipse II",
      "grid": [
        [
          "F",
          "A",
          "L",
          "S",
          "E"
        ],
        [
          "A",
          "R",
          "O",
          "M",
          "A"
        ],
        [
          "L",
          "O",
          "W",
          "E",
          "R"
        ],
        [
          "S",
          "M",
          "E",
          "L",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FALSE",
          "clue": "Untrue or contrary to established fact"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "AROMA",
          "clue": "Pleasant and distinctive fragrant scent"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "LOWER",
          "clue": "Reduce in altitude, volume, or placement"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SMELT",
          "clue": "Smelt - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FALSE",
          "clue": "Untrue or contrary to established fact"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "AROMA",
          "clue": "Pleasant and distinctive fragrant scent"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "LOWER",
          "clue": "Reduce in altitude, volume, or placement"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SMELT",
          "clue": "Smelt - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        }
      ]
    },
    {
      "id": "m66",
      "title": "Harbor Lights II",
      "grid": [
        [
          "F",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "N",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "m67",
      "title": "Silent Meadow II",
      "grid": [
        [
          "F",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "N",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "m68",
      "title": "Timber Ridge II",
      "grid": [
        [
          "F",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "R",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STORE",
          "clue": "Store - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STORE",
          "clue": "Store - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "m69",
      "title": "Citrus Grove II",
      "grid": [
        [
          "F",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "R",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STORE",
          "clue": "Store - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STORE",
          "clue": "Store - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "m70",
      "title": "Northern Lights II",
      "grid": [
        [
          "F",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "V",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STOVE",
          "clue": "Appliance with hot burners for cooking stew"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STOVE",
          "clue": "Appliance with hot burners for cooking stew"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "m71",
      "title": "Rustic Cabin II",
      "grid": [
        [
          "F",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "V",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STOVE",
          "clue": "Appliance with hot burners for cooking stew"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STOVE",
          "clue": "Appliance with hot burners for cooking stew"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "m72",
      "title": "Breezy Point II",
      "grid": [
        [
          "F",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "K",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STOKE",
          "clue": "Add fuel chunks to keep boiler fire roaring"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STOKE",
          "clue": "Add fuel chunks to keep boiler fire roaring"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "m73",
      "title": "Twilight Shadows II",
      "grid": [
        [
          "F",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "K",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STOKE",
          "clue": "Add fuel chunks to keep boiler fire roaring"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STOKE",
          "clue": "Add fuel chunks to keep boiler fire roaring"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "m74",
      "title": "Sunken Reef II",
      "grid": [
        [
          "F",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "M",
          "B",
          "E",
          "R"
        ],
        [
          "A",
          "B",
          "I",
          "D",
          "E"
        ],
        [
          "S",
          "E",
          "D",
          "A",
          "N"
        ],
        [
          "T",
          "R",
          "E",
          "N",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EMBER",
          "clue": "Glowing coal fragment in dying campfire"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ABIDE",
          "clue": "Tolerate, endure, or remain steadfast"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SEDAN",
          "clue": "Sedan - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FEAST",
          "clue": "Sumptuous banquet celebration of food"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EMBER",
          "clue": "Glowing coal fragment in dying campfire"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ABIDE",
          "clue": "Tolerate, endure, or remain steadfast"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SEDAN",
          "clue": "Sedan - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ]
    },
    {
      "id": "m75",
      "title": "Glacial Peaks II",
      "grid": [
        [
          "F",
          "L",
          "A",
          "M",
          "E"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "R"
        ],
        [
          "A",
          "N",
          "G",
          "R",
          "Y"
        ],
        [
          "M",
          "E",
          "R",
          "G",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FLAME",
          "clue": "Hot glowing tongue of fiery campfire"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ANGRY",
          "clue": "Feeling or expressing intense ire"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FLAME",
          "clue": "Hot glowing tongue of fiery campfire"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ANGRY",
          "clue": "Feeling or expressing intense ire"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "m76",
      "title": "Orchard Path II",
      "grid": [
        [
          "F",
          "L",
          "I",
          "N",
          "G"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "R"
        ],
        [
          "I",
          "N",
          "U",
          "R",
          "E"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "G",
          "R",
          "E",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FLING",
          "clue": "Fling - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "GREED",
          "clue": "Excessive insatiable desire for wealth"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FLING",
          "clue": "Fling - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "GREED",
          "clue": "Excessive insatiable desire for wealth"
        }
      ]
    },
    {
      "id": "m77",
      "title": "Azure Lagoon II",
      "grid": [
        [
          "F",
          "L",
          "I",
          "N",
          "G"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "R"
        ],
        [
          "I",
          "N",
          "U",
          "R",
          "E"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "G",
          "R",
          "E",
          "E",
          "T"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FLING",
          "clue": "Fling - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "GREET",
          "clue": "Welcome someone with a warm handshake"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FLING",
          "clue": "Fling - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "INURE",
          "clue": "Inure - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "GREET",
          "clue": "Welcome someone with a warm handshake"
        }
      ]
    },
    {
      "id": "m78",
      "title": "Winding Stream II",
      "grid": [
        [
          "F",
          "O",
          "R",
          "G",
          "E"
        ],
        [
          "O",
          "P",
          "E",
          "R",
          "A"
        ],
        [
          "R",
          "E",
          "F",
          "E",
          "R"
        ],
        [
          "G",
          "R",
          "E",
          "E",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FORGE",
          "clue": "Furnace where blacksmith hammers steel"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "OPERA",
          "clue": "Staged theatrical drama set entirely to song"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "REFER",
          "clue": "Refer - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "GREET",
          "clue": "Welcome someone with a warm handshake"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FORGE",
          "clue": "Furnace where blacksmith hammers steel"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "OPERA",
          "clue": "Staged theatrical drama set entirely to song"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "REFER",
          "clue": "Refer - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "GREET",
          "clue": "Welcome someone with a warm handshake"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        }
      ]
    },
    {
      "id": "m79",
      "title": "Starry Night II",
      "grid": [
        [
          "F",
          "R",
          "A",
          "M",
          "E"
        ],
        [
          "R",
          "E",
          "L",
          "A",
          "X"
        ],
        [
          "A",
          "L",
          "O",
          "N",
          "E"
        ],
        [
          "M",
          "A",
          "N",
          "O",
          "R"
        ],
        [
          "E",
          "X",
          "E",
          "R",
          "T"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FRAME",
          "clue": "Rigid decorative border around an artwork"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RELAX",
          "clue": "Release tension and rest in serene tranquility"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ALONE",
          "clue": "Having no others present; solitary"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "MANOR",
          "clue": "Stately historical mansion on country estate"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "EXERT",
          "clue": "Apply vigorous strength or willpower"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FRAME",
          "clue": "Rigid decorative border around an artwork"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RELAX",
          "clue": "Release tension and rest in serene tranquility"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ALONE",
          "clue": "Having no others present; solitary"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "MANOR",
          "clue": "Stately historical mansion on country estate"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "EXERT",
          "clue": "Apply vigorous strength or willpower"
        }
      ]
    },
    {
      "id": "m80",
      "title": "Hearth & Home II",
      "grid": [
        [
          "F",
          "R",
          "O",
          "S",
          "T"
        ],
        [
          "R",
          "U",
          "L",
          "E",
          "R"
        ],
        [
          "O",
          "L",
          "I",
          "V",
          "E"
        ],
        [
          "S",
          "E",
          "V",
          "E",
          "N"
        ],
        [
          "T",
          "R",
          "E",
          "N",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FROST",
          "clue": "Delicate icy crystalline coating at dawn"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RULER",
          "clue": "Ruler - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "OLIVE",
          "clue": "Savory green Mediterranean fruit on salads"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SEVEN",
          "clue": "Seven - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "FROST",
          "clue": "Delicate icy crystalline coating at dawn"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RULER",
          "clue": "Ruler - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "OLIVE",
          "clue": "Savory green Mediterranean fruit on salads"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SEVEN",
          "clue": "Seven - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ]
    }
  ],
  "hard": [
    {
      "id": "h81",
      "title": "Golden Meadows III",
      "grid": [
        [
          "G",
          "L",
          "A",
          "N",
          "D"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "R"
        ],
        [
          "A",
          "N",
          "G",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "D",
          "R",
          "Y",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GLAND",
          "clue": "Organ secreting biochemical hormones"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ANGRY",
          "clue": "Feeling or expressing intense ire"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GLAND",
          "clue": "Organ secreting biochemical hormones"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ANGRY",
          "clue": "Feeling or expressing intense ire"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ]
    },
    {
      "id": "h82",
      "title": "Starlight Orbit III",
      "grid": [
        [
          "G",
          "L",
          "A",
          "S",
          "S"
        ],
        [
          "L",
          "E",
          "G",
          "A",
          "L"
        ],
        [
          "A",
          "G",
          "I",
          "L",
          "E"
        ],
        [
          "S",
          "A",
          "L",
          "V",
          "E"
        ],
        [
          "S",
          "L",
          "E",
          "E",
          "K"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GLASS",
          "clue": "Hard brittle transparent silicate pane"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SALVE",
          "clue": "Salve - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "SLEEK",
          "clue": "Sleek - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GLASS",
          "clue": "Hard brittle transparent silicate pane"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SALVE",
          "clue": "Salve - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "SLEEK",
          "clue": "Sleek - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h83",
      "title": "Ocean Breeze III",
      "grid": [
        [
          "G",
          "L",
          "A",
          "S",
          "S"
        ],
        [
          "L",
          "E",
          "G",
          "A",
          "L"
        ],
        [
          "A",
          "G",
          "I",
          "L",
          "E"
        ],
        [
          "S",
          "A",
          "L",
          "V",
          "E"
        ],
        [
          "S",
          "L",
          "E",
          "E",
          "T"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GLASS",
          "clue": "Hard brittle transparent silicate pane"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SALVE",
          "clue": "Salve - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "SLEET",
          "clue": "Chilly freezing rain pellets falling winter"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GLASS",
          "clue": "Hard brittle transparent silicate pane"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SALVE",
          "clue": "Salve - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "SLEET",
          "clue": "Chilly freezing rain pellets falling winter"
        }
      ]
    },
    {
      "id": "h84",
      "title": "Springtime Glow III",
      "grid": [
        [
          "G",
          "L",
          "A",
          "S",
          "S"
        ],
        [
          "L",
          "E",
          "G",
          "A",
          "L"
        ],
        [
          "A",
          "G",
          "I",
          "L",
          "E"
        ],
        [
          "S",
          "A",
          "L",
          "V",
          "E"
        ],
        [
          "S",
          "L",
          "E",
          "E",
          "P"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GLASS",
          "clue": "Hard brittle transparent silicate pane"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SALVE",
          "clue": "Salve - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "SLEEP",
          "clue": "Periodic natural state of restful slumber"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GLASS",
          "clue": "Hard brittle transparent silicate pane"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LEGAL",
          "clue": "Legal - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SALVE",
          "clue": "Salve - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "SLEEP",
          "clue": "Periodic natural state of restful slumber"
        }
      ]
    },
    {
      "id": "h85",
      "title": "Mountain Crest III",
      "grid": [
        [
          "G",
          "R",
          "A",
          "C",
          "E"
        ],
        [
          "R",
          "U",
          "L",
          "E",
          "R"
        ],
        [
          "A",
          "L",
          "L",
          "A",
          "Y"
        ],
        [
          "C",
          "E",
          "A",
          "S",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GRACE",
          "clue": "Elegance of movement or divine mercy"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RULER",
          "clue": "Ruler - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ALLAY",
          "clue": "Diminish fear, anxiety, or suspicion"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "CEASE",
          "clue": "Cease - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GRACE",
          "clue": "Elegance of movement or divine mercy"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RULER",
          "clue": "Ruler - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ALLAY",
          "clue": "Diminish fear, anxiety, or suspicion"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "CEASE",
          "clue": "Cease - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h86",
      "title": "Ancient Forest III",
      "grid": [
        [
          "G",
          "R",
          "I",
          "M",
          "E"
        ],
        [
          "R",
          "I",
          "V",
          "E",
          "R"
        ],
        [
          "I",
          "V",
          "O",
          "R",
          "Y"
        ],
        [
          "M",
          "E",
          "R",
          "G",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GRIME",
          "clue": "Dirt or soot encrusted on surfaces"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RIVER",
          "clue": "Vast freshwater flow winding toward the sea"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GRIME",
          "clue": "Dirt or soot encrusted on surfaces"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RIVER",
          "clue": "Vast freshwater flow winding toward the sea"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h87",
      "title": "Crystal Brook III",
      "grid": [
        [
          "G",
          "R",
          "I",
          "M",
          "E"
        ],
        [
          "R",
          "O",
          "V",
          "E",
          "R"
        ],
        [
          "I",
          "V",
          "O",
          "R",
          "Y"
        ],
        [
          "M",
          "E",
          "R",
          "G",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GRIME",
          "clue": "Dirt or soot encrusted on surfaces"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "ROVER",
          "clue": "Rover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GRIME",
          "clue": "Dirt or soot encrusted on surfaces"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "ROVER",
          "clue": "Rover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h88",
      "title": "Midnight Echo III",
      "grid": [
        [
          "G",
          "R",
          "I",
          "N",
          "D"
        ],
        [
          "R",
          "I",
          "V",
          "E",
          "R"
        ],
        [
          "I",
          "V",
          "O",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "D",
          "R",
          "Y",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GRIND",
          "clue": "Crush coffee beans into fine grounds"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RIVER",
          "clue": "Vast freshwater flow winding toward the sea"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GRIND",
          "clue": "Crush coffee beans into fine grounds"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RIVER",
          "clue": "Vast freshwater flow winding toward the sea"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ]
    },
    {
      "id": "h89",
      "title": "Sunrise Valley III",
      "grid": [
        [
          "G",
          "R",
          "I",
          "N",
          "D"
        ],
        [
          "R",
          "O",
          "V",
          "E",
          "R"
        ],
        [
          "I",
          "V",
          "O",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "D",
          "R",
          "Y",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GRIND",
          "clue": "Crush coffee beans into fine grounds"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "ROVER",
          "clue": "Rover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GRIND",
          "clue": "Crush coffee beans into fine grounds"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "ROVER",
          "clue": "Rover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "DRYER",
          "clue": "Household appliance tumbling warm clothes"
        }
      ]
    },
    {
      "id": "h90",
      "title": "Silver Timber III",
      "grid": [
        [
          "G",
          "U",
          "S",
          "T",
          "O"
        ],
        [
          "U",
          "P",
          "P",
          "E",
          "R"
        ],
        [
          "S",
          "P",
          "E",
          "N",
          "D"
        ],
        [
          "T",
          "E",
          "N",
          "S",
          "E"
        ],
        [
          "O",
          "R",
          "D",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GUSTO",
          "clue": "Gusto - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "UPPER",
          "clue": "Upper - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "SPEND",
          "clue": "Spend - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "TENSE",
          "clue": "Tense - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ORDER",
          "clue": "Order - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GUSTO",
          "clue": "Gusto - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "UPPER",
          "clue": "Upper - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "SPEND",
          "clue": "Spend - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "TENSE",
          "clue": "Tense - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ORDER",
          "clue": "Order - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h91",
      "title": "Autumn Leaves III",
      "grid": [
        [
          "G",
          "U",
          "S",
          "T",
          "O"
        ],
        [
          "U",
          "T",
          "T",
          "E",
          "R"
        ],
        [
          "S",
          "T",
          "A",
          "N",
          "D"
        ],
        [
          "T",
          "E",
          "N",
          "S",
          "E"
        ],
        [
          "O",
          "R",
          "D",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GUSTO",
          "clue": "Gusto - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "UTTER",
          "clue": "Utter - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "STAND",
          "clue": "Rise upright onto your two feet firmly"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "TENSE",
          "clue": "Tense - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ORDER",
          "clue": "Order - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "GUSTO",
          "clue": "Gusto - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "UTTER",
          "clue": "Utter - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "STAND",
          "clue": "Rise upright onto your two feet firmly"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "TENSE",
          "clue": "Tense - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ORDER",
          "clue": "Order - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h92",
      "title": "Desert Mirage III",
      "grid": [
        [
          "H",
          "E",
          "R",
          "B",
          "S"
        ],
        [
          "E",
          "X",
          "I",
          "L",
          "E"
        ],
        [
          "R",
          "I",
          "S",
          "E",
          "N"
        ],
        [
          "B",
          "L",
          "E",
          "S",
          "S"
        ],
        [
          "S",
          "E",
          "N",
          "S",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "HERBS",
          "clue": "Aromatic culinary plants for seasoning"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EXILE",
          "clue": "Banishment from one's beloved homeland"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "RISEN",
          "clue": "Risen - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "BLESS",
          "clue": "Consecrate or wish heavenly divine favor"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "SENSE",
          "clue": "Sense - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "HERBS",
          "clue": "Aromatic culinary plants for seasoning"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EXILE",
          "clue": "Banishment from one's beloved homeland"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "RISEN",
          "clue": "Risen - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "BLESS",
          "clue": "Consecrate or wish heavenly divine favor"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "SENSE",
          "clue": "Sense - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h93",
      "title": "River Odyssey III",
      "grid": [
        [
          "L",
          "A",
          "T",
          "H",
          "E"
        ],
        [
          "A",
          "P",
          "R",
          "O",
          "N"
        ],
        [
          "T",
          "R",
          "O",
          "U",
          "T"
        ],
        [
          "H",
          "O",
          "U",
          "S",
          "E"
        ],
        [
          "E",
          "N",
          "T",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LATHE",
          "clue": "Lathe - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "APRON",
          "clue": "Protective garment worn while cooking"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "TROUT",
          "clue": "Trout - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "HOUSE",
          "clue": "Residential dwelling under a shingle roof"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ENTER",
          "clue": "Step inside through the open threshold"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LATHE",
          "clue": "Lathe - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "APRON",
          "clue": "Protective garment worn while cooking"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "TROUT",
          "clue": "Trout - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "HOUSE",
          "clue": "Residential dwelling under a shingle roof"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ENTER",
          "clue": "Step inside through the open threshold"
        }
      ]
    },
    {
      "id": "h94",
      "title": "Sapphire Skies III",
      "grid": [
        [
          "L",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "N",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "h95",
      "title": "Cobblestone Lane III",
      "grid": [
        [
          "L",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "N",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STONE",
          "clue": "Dense geological rock picked up on trail"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h96",
      "title": "Emerald Grove III",
      "grid": [
        [
          "L",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "R",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STORE",
          "clue": "Store - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STORE",
          "clue": "Store - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "h97",
      "title": "Thunder Peak III",
      "grid": [
        [
          "L",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "R",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STORE",
          "clue": "Store - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STORE",
          "clue": "Store - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h98",
      "title": "Velvet Twilight III",
      "grid": [
        [
          "L",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "V",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STOVE",
          "clue": "Appliance with hot burners for cooking stew"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STOVE",
          "clue": "Appliance with hot burners for cooking stew"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "h99",
      "title": "Island Harbor III",
      "grid": [
        [
          "L",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "V",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STOVE",
          "clue": "Appliance with hot burners for cooking stew"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STOVE",
          "clue": "Appliance with hot burners for cooking stew"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h100",
      "title": "Whispering Pines III",
      "grid": [
        [
          "L",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "K",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "E"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STOKE",
          "clue": "Add fuel chunks to keep boiler fire roaring"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STOKE",
          "clue": "Add fuel chunks to keep boiler fire roaring"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREE",
          "clue": "Number of points scored on basketball arc"
        }
      ]
    },
    {
      "id": "h101",
      "title": "Solar Flares III",
      "grid": [
        [
          "L",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        [
          "A",
          "R",
          "M",
          "O",
          "R"
        ],
        [
          "S",
          "T",
          "O",
          "K",
          "E"
        ],
        [
          "T",
          "H",
          "R",
          "E",
          "W"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "STOKE",
          "clue": "Add fuel chunks to keep boiler fire roaring"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ARMOR",
          "clue": "Protective metal plating for knights"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "STOKE",
          "clue": "Add fuel chunks to keep boiler fire roaring"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "THREW",
          "clue": "Threw - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h102",
      "title": "Mystic Cavern III",
      "grid": [
        [
          "L",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "E",
          "M",
          "B",
          "E",
          "R"
        ],
        [
          "A",
          "B",
          "I",
          "D",
          "E"
        ],
        [
          "S",
          "E",
          "D",
          "A",
          "N"
        ],
        [
          "T",
          "R",
          "E",
          "N",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EMBER",
          "clue": "Glowing coal fragment in dying campfire"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ABIDE",
          "clue": "Tolerate, endure, or remain steadfast"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SEDAN",
          "clue": "Sedan - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LEAST",
          "clue": "Least - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EMBER",
          "clue": "Glowing coal fragment in dying campfire"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ABIDE",
          "clue": "Tolerate, endure, or remain steadfast"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SEDAN",
          "clue": "Sedan - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TREND",
          "clue": "Prevailing general direction of cultural change"
        }
      ]
    },
    {
      "id": "h103",
      "title": "Alpine Haven III",
      "grid": [
        [
          "L",
          "I",
          "M",
          "B",
          "O"
        ],
        [
          "I",
          "N",
          "E",
          "R",
          "T"
        ],
        [
          "M",
          "E",
          "R",
          "I",
          "T"
        ],
        [
          "B",
          "R",
          "I",
          "D",
          "E"
        ],
        [
          "O",
          "T",
          "T",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LIMBO",
          "clue": "Limbo - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "INERT",
          "clue": "Lacking active chemical energy or movement"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "MERIT",
          "clue": "Quality of being particularly worthy of praise"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "BRIDE",
          "clue": "Woman walking down the wedding aisle"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "OTTER",
          "clue": "Otter - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LIMBO",
          "clue": "Limbo - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "INERT",
          "clue": "Lacking active chemical energy or movement"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "MERIT",
          "clue": "Quality of being particularly worthy of praise"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "BRIDE",
          "clue": "Woman walking down the wedding aisle"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "OTTER",
          "clue": "Otter - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h104",
      "title": "Radiant Horizon III",
      "grid": [
        [
          "L",
          "I",
          "M",
          "B",
          "O"
        ],
        [
          "I",
          "N",
          "E",
          "R",
          "T"
        ],
        [
          "M",
          "E",
          "R",
          "I",
          "T"
        ],
        [
          "B",
          "R",
          "I",
          "N",
          "E"
        ],
        [
          "O",
          "T",
          "T",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LIMBO",
          "clue": "Limbo - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "INERT",
          "clue": "Lacking active chemical energy or movement"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "MERIT",
          "clue": "Quality of being particularly worthy of praise"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "BRINE",
          "clue": "Highly concentrated salty seawater soak"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "OTTER",
          "clue": "Otter - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "LIMBO",
          "clue": "Limbo - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "INERT",
          "clue": "Lacking active chemical energy or movement"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "MERIT",
          "clue": "Quality of being particularly worthy of praise"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "BRINE",
          "clue": "Highly concentrated salty seawater soak"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "OTTER",
          "clue": "Otter - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h105",
      "title": "Lunar Eclipse III",
      "grid": [
        [
          "M",
          "O",
          "R",
          "A",
          "L"
        ],
        [
          "O",
          "P",
          "E",
          "R",
          "A"
        ],
        [
          "R",
          "E",
          "P",
          "O",
          "T"
        ],
        [
          "A",
          "R",
          "O",
          "S",
          "E"
        ],
        [
          "L",
          "A",
          "T",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "MORAL",
          "clue": "Moral - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "OPERA",
          "clue": "Staged theatrical drama set entirely to song"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "REPOT",
          "clue": "Repot - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "AROSE",
          "clue": "Ascended upward or came into view"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "LATER",
          "clue": "At a subsequent period in the afternoon"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "MORAL",
          "clue": "Moral - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "OPERA",
          "clue": "Staged theatrical drama set entirely to song"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "REPOT",
          "clue": "Repot - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "AROSE",
          "clue": "Ascended upward or came into view"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "LATER",
          "clue": "At a subsequent period in the afternoon"
        }
      ]
    },
    {
      "id": "h106",
      "title": "Harbor Lights III",
      "grid": [
        [
          "N",
          "A",
          "V",
          "A",
          "L"
        ],
        [
          "A",
          "G",
          "I",
          "L",
          "E"
        ],
        [
          "V",
          "I",
          "S",
          "T",
          "A"
        ],
        [
          "A",
          "L",
          "T",
          "E",
          "R"
        ],
        [
          "L",
          "E",
          "A",
          "R",
          "N"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "NAVAL",
          "clue": "Naval - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "VISTA",
          "clue": "Vista - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "ALTER",
          "clue": "Modify, reshape, or change slightly"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "LEARN",
          "clue": "Learn - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "NAVAL",
          "clue": "Naval - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "AGILE",
          "clue": "Quick and nimble in physical movement"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "VISTA",
          "clue": "Vista - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "ALTER",
          "clue": "Modify, reshape, or change slightly"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "LEARN",
          "clue": "Learn - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h107",
      "title": "Silent Meadow III",
      "grid": [
        [
          "N",
          "O",
          "B",
          "L",
          "E"
        ],
        [
          "O",
          "C",
          "E",
          "A",
          "N"
        ],
        [
          "B",
          "E",
          "A",
          "R",
          "D"
        ],
        [
          "L",
          "A",
          "R",
          "G",
          "E"
        ],
        [
          "E",
          "N",
          "D",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "NOBLE",
          "clue": "Possessing elevated aristocratic virtues"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "OCEAN",
          "clue": "Immense body of saltwater covering earth"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "BEARD",
          "clue": "Facial hair grown on chin and cheeks"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "LARGE",
          "clue": "Large - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ENDED",
          "clue": "Reached the final concluding curtain drop"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "NOBLE",
          "clue": "Possessing elevated aristocratic virtues"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "OCEAN",
          "clue": "Immense body of saltwater covering earth"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "BEARD",
          "clue": "Facial hair grown on chin and cheeks"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "LARGE",
          "clue": "Large - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ENDED",
          "clue": "Reached the final concluding curtain drop"
        }
      ]
    },
    {
      "id": "h108",
      "title": "Timber Ridge III",
      "grid": [
        [
          "N",
          "O",
          "B",
          "L",
          "E"
        ],
        [
          "O",
          "C",
          "E",
          "A",
          "N"
        ],
        [
          "B",
          "E",
          "A",
          "S",
          "T"
        ],
        [
          "L",
          "A",
          "S",
          "E",
          "R"
        ],
        [
          "E",
          "N",
          "T",
          "R",
          "Y"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "NOBLE",
          "clue": "Possessing elevated aristocratic virtues"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "OCEAN",
          "clue": "Immense body of saltwater covering earth"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "LASER",
          "clue": "Focused beam of coherent monochromatic light"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ENTRY",
          "clue": "Entry - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "NOBLE",
          "clue": "Possessing elevated aristocratic virtues"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "OCEAN",
          "clue": "Immense body of saltwater covering earth"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "BEAST",
          "clue": "Ferocious four-footed creature of the wild"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "LASER",
          "clue": "Focused beam of coherent monochromatic light"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ENTRY",
          "clue": "Entry - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h109",
      "title": "Citrus Grove III",
      "grid": [
        [
          "N",
          "O",
          "N",
          "C",
          "E"
        ],
        [
          "O",
          "P",
          "E",
          "R",
          "A"
        ],
        [
          "N",
          "E",
          "V",
          "E",
          "R"
        ],
        [
          "C",
          "R",
          "E",
          "S",
          "T"
        ],
        [
          "E",
          "A",
          "R",
          "T",
          "H"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "NONCE",
          "clue": "Nonce - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "OPERA",
          "clue": "Staged theatrical drama set entirely to song"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "NEVER",
          "clue": "Never - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "CREST",
          "clue": "Highest ridge peak of a breaking wave"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "NONCE",
          "clue": "Nonce - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "OPERA",
          "clue": "Staged theatrical drama set entirely to song"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "NEVER",
          "clue": "Never - 5-letter deduction word"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "CREST",
          "clue": "Highest ridge peak of a breaking wave"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "EARTH",
          "clue": "Third planet orbiting sun; rich soil"
        }
      ]
    },
    {
      "id": "h110",
      "title": "Northern Lights III",
      "grid": [
        [
          "P",
          "H",
          "A",
          "S",
          "E"
        ],
        [
          "H",
          "A",
          "V",
          "E",
          "N"
        ],
        [
          "A",
          "V",
          "O",
          "I",
          "D"
        ],
        [
          "S",
          "E",
          "I",
          "Z",
          "E"
        ],
        [
          "E",
          "N",
          "D",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "PHASE",
          "clue": "Phase - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "HAVEN",
          "clue": "Place of safe harbor, refuge, and calm"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AVOID",
          "clue": "Stay away from or prevent happening"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SEIZE",
          "clue": "Seize - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ENDED",
          "clue": "Reached the final concluding curtain drop"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "PHASE",
          "clue": "Phase - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "HAVEN",
          "clue": "Place of safe harbor, refuge, and calm"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AVOID",
          "clue": "Stay away from or prevent happening"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SEIZE",
          "clue": "Seize - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ENDED",
          "clue": "Reached the final concluding curtain drop"
        }
      ]
    },
    {
      "id": "h111",
      "title": "Rustic Cabin III",
      "grid": [
        [
          "P",
          "I",
          "A",
          "N",
          "O"
        ],
        [
          "I",
          "N",
          "P",
          "U",
          "T"
        ],
        [
          "A",
          "P",
          "A",
          "R",
          "T"
        ],
        [
          "N",
          "U",
          "R",
          "S",
          "E"
        ],
        [
          "O",
          "T",
          "T",
          "E",
          "R"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "PIANO",
          "clue": "Piano - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "INPUT",
          "clue": "Data entered into computer memory banks"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "APART",
          "clue": "Separated by distance or time"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NURSE",
          "clue": "Nurse - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "OTTER",
          "clue": "Otter - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "PIANO",
          "clue": "Piano - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "INPUT",
          "clue": "Data entered into computer memory banks"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "APART",
          "clue": "Separated by distance or time"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NURSE",
          "clue": "Nurse - 5-letter deduction word"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "OTTER",
          "clue": "Otter - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h112",
      "title": "Breezy Point III",
      "grid": [
        [
          "P",
          "L",
          "A",
          "N",
          "E"
        ],
        [
          "L",
          "I",
          "N",
          "E",
          "R"
        ],
        [
          "A",
          "N",
          "G",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "PLANE",
          "clue": "Plane - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ANGRY",
          "clue": "Feeling or expressing intense ire"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "PLANE",
          "clue": "Plane - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "LINER",
          "clue": "Liner - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ANGRY",
          "clue": "Feeling or expressing intense ire"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h113",
      "title": "Twilight Shadows III",
      "grid": [
        [
          "P",
          "R",
          "I",
          "M",
          "E"
        ],
        [
          "R",
          "I",
          "V",
          "E",
          "R"
        ],
        [
          "I",
          "V",
          "O",
          "R",
          "Y"
        ],
        [
          "M",
          "E",
          "R",
          "G",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "PRIME",
          "clue": "First in importance or divisible only by itself"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RIVER",
          "clue": "Vast freshwater flow winding toward the sea"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "PRIME",
          "clue": "First in importance or divisible only by itself"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RIVER",
          "clue": "Vast freshwater flow winding toward the sea"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h114",
      "title": "Sunken Reef III",
      "grid": [
        [
          "P",
          "R",
          "I",
          "M",
          "E"
        ],
        [
          "R",
          "O",
          "V",
          "E",
          "R"
        ],
        [
          "I",
          "V",
          "O",
          "R",
          "Y"
        ],
        [
          "M",
          "E",
          "R",
          "G",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "PRIME",
          "clue": "First in importance or divisible only by itself"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "ROVER",
          "clue": "Rover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "PRIME",
          "clue": "First in importance or divisible only by itself"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "ROVER",
          "clue": "Rover - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "IVORY",
          "clue": "Hard cream-white material of elephant tusks"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "MERGE",
          "clue": "Combine two highways or streams into one"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h115",
      "title": "Glacial Peaks III",
      "grid": [
        [
          "P",
          "R",
          "O",
          "S",
          "E"
        ],
        [
          "R",
          "E",
          "L",
          "A",
          "X"
        ],
        [
          "O",
          "L",
          "I",
          "V",
          "E"
        ],
        [
          "S",
          "A",
          "V",
          "O",
          "R"
        ],
        [
          "E",
          "X",
          "E",
          "R",
          "T"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "PROSE",
          "clue": "Prose - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "RELAX",
          "clue": "Release tension and rest in serene tranquility"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "OLIVE",
          "clue": "Savory green Mediterranean fruit on salads"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SAVOR",
          "clue": "Enjoy flavor or cherish meaningful moment"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "EXERT",
          "clue": "Apply vigorous strength or willpower"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "PROSE",
          "clue": "Prose - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "RELAX",
          "clue": "Release tension and rest in serene tranquility"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "OLIVE",
          "clue": "Savory green Mediterranean fruit on salads"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SAVOR",
          "clue": "Enjoy flavor or cherish meaningful moment"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "EXERT",
          "clue": "Apply vigorous strength or willpower"
        }
      ]
    },
    {
      "id": "h116",
      "title": "Orchard Path III",
      "grid": [
        [
          "Q",
          "U",
          "A",
          "S",
          "I"
        ],
        [
          "U",
          "N",
          "I",
          "O",
          "N"
        ],
        [
          "A",
          "I",
          "S",
          "L",
          "E"
        ],
        [
          "S",
          "O",
          "L",
          "A",
          "R"
        ],
        [
          "I",
          "N",
          "E",
          "R",
          "T"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "QUASI",
          "clue": "Quasi - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "UNION",
          "clue": "Union - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AISLE",
          "clue": "Passage walkway between rows of seats"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "SOLAR",
          "clue": "Derived from radiant thermonuclear sun rays"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "INERT",
          "clue": "Lacking active chemical energy or movement"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "QUASI",
          "clue": "Quasi - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "UNION",
          "clue": "Union - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AISLE",
          "clue": "Passage walkway between rows of seats"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "SOLAR",
          "clue": "Derived from radiant thermonuclear sun rays"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "INERT",
          "clue": "Lacking active chemical energy or movement"
        }
      ]
    },
    {
      "id": "h117",
      "title": "Azure Lagoon III",
      "grid": [
        [
          "R",
          "E",
          "A",
          "C",
          "T"
        ],
        [
          "E",
          "I",
          "G",
          "H",
          "T"
        ],
        [
          "A",
          "G",
          "R",
          "E",
          "E"
        ],
        [
          "C",
          "H",
          "E",
          "S",
          "S"
        ],
        [
          "T",
          "T",
          "E",
          "S",
          "T"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "REACT",
          "clue": "React - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EIGHT",
          "clue": "Number following seven; cube of two"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AGREE",
          "clue": "Concur or share the identical opinion"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "CHESS",
          "clue": "Strategic board game of kings and pawns"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TTEST",
          "clue": "Statistical assessment comparing data samples"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "REACT",
          "clue": "React - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EIGHT",
          "clue": "Number following seven; cube of two"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AGREE",
          "clue": "Concur or share the identical opinion"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "CHESS",
          "clue": "Strategic board game of kings and pawns"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TTEST",
          "clue": "Statistical assessment comparing data samples"
        }
      ]
    },
    {
      "id": "h118",
      "title": "Winding Stream III",
      "grid": [
        [
          "R",
          "E",
          "A",
          "C",
          "T"
        ],
        [
          "E",
          "A",
          "G",
          "L",
          "E"
        ],
        [
          "A",
          "G",
          "R",
          "E",
          "E"
        ],
        [
          "C",
          "L",
          "E",
          "A",
          "N"
        ],
        [
          "T",
          "E",
          "E",
          "N",
          "S"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "REACT",
          "clue": "React - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "EAGLE",
          "clue": "Eagle - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "AGREE",
          "clue": "Concur or share the identical opinion"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "CLEAN",
          "clue": "Free from dirt, dust, or contamination"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "TEENS",
          "clue": "Youthful adolescent years between 13 and 19"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "REACT",
          "clue": "React - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "EAGLE",
          "clue": "Eagle - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "AGREE",
          "clue": "Concur or share the identical opinion"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "CLEAN",
          "clue": "Free from dirt, dust, or contamination"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "TEENS",
          "clue": "Youthful adolescent years between 13 and 19"
        }
      ]
    },
    {
      "id": "h119",
      "title": "Starry Night III",
      "grid": [
        [
          "S",
          "C",
          "E",
          "N",
          "E"
        ],
        [
          "C",
          "O",
          "V",
          "E",
          "R"
        ],
        [
          "E",
          "V",
          "E",
          "R",
          "Y"
        ],
        [
          "N",
          "E",
          "R",
          "V",
          "E"
        ],
        [
          "E",
          "R",
          "Y",
          "E",
          "D"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "SCENE",
          "clue": "Visual backdrop or division of theatrical play"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "COVER",
          "clue": "Protective lid or illustrated book jacket"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "EVERY",
          "clue": "All members of a category without lack"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "SCENE",
          "clue": "Visual backdrop or division of theatrical play"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "COVER",
          "clue": "Protective lid or illustrated book jacket"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "EVERY",
          "clue": "All members of a category without lack"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "NERVE",
          "clue": "Biological bundle transmitting bodily signals"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "ERYED",
          "clue": "Eryed - 5-letter deduction word"
        }
      ]
    },
    {
      "id": "h120",
      "title": "Hearth & Home III",
      "grid": [
        [
          "S",
          "C",
          "R",
          "A",
          "M"
        ],
        [
          "C",
          "H",
          "O",
          "R",
          "E"
        ],
        [
          "R",
          "O",
          "B",
          "O",
          "T"
        ],
        [
          "A",
          "R",
          "O",
          "M",
          "A"
        ],
        [
          "M",
          "E",
          "T",
          "A",
          "L"
        ]
      ],
      "across": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "SCRAM",
          "clue": "Scram - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 1,
          "col": 0,
          "word": "CHORE",
          "clue": "Chore - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 2,
          "col": 0,
          "word": "ROBOT",
          "clue": "Autonomous programmable electromechanical machine"
        },
        {
          "num": 4,
          "row": 3,
          "col": 0,
          "word": "AROMA",
          "clue": "Pleasant and distinctive fragrant scent"
        },
        {
          "num": 5,
          "row": 4,
          "col": 0,
          "word": "METAL",
          "clue": "Metal - 5-letter deduction word"
        }
      ],
      "down": [
        {
          "num": 1,
          "row": 0,
          "col": 0,
          "word": "SCRAM",
          "clue": "Scram - 5-letter deduction word"
        },
        {
          "num": 2,
          "row": 0,
          "col": 1,
          "word": "CHORE",
          "clue": "Chore - 5-letter deduction word"
        },
        {
          "num": 3,
          "row": 0,
          "col": 2,
          "word": "ROBOT",
          "clue": "Autonomous programmable electromechanical machine"
        },
        {
          "num": 4,
          "row": 0,
          "col": 3,
          "word": "AROMA",
          "clue": "Pleasant and distinctive fragrant scent"
        },
        {
          "num": 5,
          "row": 0,
          "col": 4,
          "word": "METAL",
          "clue": "Metal - 5-letter deduction word"
        }
      ]
    }
  ]
};

const ALL_PUZZLES = [
  ...PUZZLE_BANK.easy,
  ...PUZZLE_BANK.medium,
  ...PUZZLE_BANK.hard,
];

function getCrosswordPuzzle(rng, tier, dateStr) {
  let idx = 0;
  if (dateStr) {
    const dayNum = Math.floor(new Date(dateStr).getTime() / 86400000);
    const tierOffset = tier === 'easy' ? 0 : tier === 'medium' ? 40 : 80;
    idx = Math.abs((dayNum + tierOffset) % ALL_PUZZLES.length);
  } else {
    idx = rng.nextInt(0, ALL_PUZZLES.length);
  }
  return {
    tier,
    ...ALL_PUZZLES[idx],
  };
}

export const gameConfig = {
  id: 'crossword',
  slug: 'crossword',
  title: 'Crossword',
  description: 'Solve the daily 5x5 mini crossword with intersecting Across & Down clues!',
  badge: 'Word Puzzle',
  icon: '📝',
  thumbnail: '/images/crossword.png',
  isFree: false,
  gameUnlockCost: 150,

  difficulties: {
    easy: {
      unlockCost: 0,
      rewardCoins: 15,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`crossword-easy-${dateStr}`);
        return getCrosswordPuzzle(rng, 'easy', dateStr);
      },
    },
    medium: {
      unlockCost: 150,
      rewardCoins: 35,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`crossword-med-${dateStr}`);
        return getCrosswordPuzzle(rng, 'medium', dateStr);
      },
    },
    hard: {
      unlockCost: 300,
      rewardCoins: 75,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`crossword-hard-${dateStr}`);
        return getCrosswordPuzzle(rng, 'hard', dateStr);
      },
    },
  },

  unlimitedPlayground: {
    unlockCost: 250,
    generatePlaygroundPuzzle: (tier = 'medium') => {
      const rng = new SeededRNG(`crossword-play-${Date.now()}-${Math.random()}`);
      return getCrosswordPuzzle(rng, tier);
    },
  },

  mount: (container, puzzle, callbacks) => {
    const { grid, across, down, title } = puzzle;
    const userGrid = Array.from({ length: 5 }, () => Array(5).fill(''));
    let activeRow = 0;
    let activeCol = 0;
    let activeDirection = 'across'; // 'across' or 'down'
    let isFinished = false;

    callbacks.setRules(`
      <h3>Mini Crossword Rules:</h3>
      <p>1. Fill the <strong>5×5 letter grid</strong> with intersecting words.</p>
      <p>2. Tap a cell or clue to toggle between <strong>Across</strong> & <strong>Down</strong>.</p>
      <p>3. Type using your physical keyboard or the on-screen keypad.</p>
      <p>4. Use Backspace to delete and arrow keys to navigate.</p>
      <p>5. Complete all words correctly to claim victory!</p>
    `);

    container.innerHTML = `
      <div class="crossword-wrapper" style="display:flex; flex-direction:column; align-items:center; gap:0.85rem; width:100%; max-width:480px; margin:0 auto; user-select:none;">
        
        <!-- Active Clue Pill Header -->
        <div id="cw-active-clue-banner" style="width:100%; padding:0.65rem 1rem; background:linear-gradient(135deg, #0284c7, #2563eb); color:#fff; border-radius:12px; font-size:0.88rem; font-weight:700; display:flex; justify-content:space-between; align-items:center; box-shadow:0 3px 10px rgba(37,99,235,0.25); cursor:pointer;">
          <div style="display:flex; align-items:center; gap:0.5rem; overflow:hidden;">
            <span id="cw-clue-badge" style="background:rgba(255,255,255,0.25); padding:2px 8px; border-radius:6px; font-size:0.75rem; text-transform:uppercase;">1-ACROSS</span>
            <span id="cw-clue-text" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Tap to switch direction</span>
          </div>
          <span style="opacity:0.85; font-size:0.8rem;">⟳ Toggle</span>
        </div>

        <!-- 5x5 Crossword Grid -->
        <div id="cw-grid-container" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px; width:100%; max-width:320px; aspect-ratio:1/1; background:#0f172a; padding:8px; border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,0.18);">
          ${Array.from({ length: 25 }, (_, idx) => {
            const r = Math.floor(idx / 5);
            const c = idx % 5;
            const cellNum = (c === 0) ? `${r + 1}` : '';
            return `
              <div class="cw-cell" data-row="${r}" data-col="${c}" style="position:relative; width:100%; height:100%; background:#ffffff; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:900; font-size:1.45rem; color:#0f172a; transition:background 0.15s, transform 0.15s;">
                <span style="position:absolute; top:2px; left:4px; font-size:0.65rem; color:#94a3b8; font-weight:700; pointer-events:none;">${cellNum}</span>
                <span class="cw-cell-letter" id="cw-cell-${r}-${c}"></span>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Clue List Accordion / Tabs -->
        <div style="width:100%; background:#f8fafc; border:1px solid var(--border-color); border-radius:14px; padding:0.75rem 1rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.4rem;">
            <div style="font-size:0.8rem; font-weight:800; color:#2563eb; text-transform:uppercase;">Across Clues</div>
            <div style="font-size:0.8rem; font-weight:800; color:#7c3aed; text-transform:uppercase;">Down Clues</div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.78rem; max-height:140px; overflow-y:auto;">
            <div id="cw-across-list" style="display:flex; flex-direction:column; gap:0.35rem;">
              ${across.map(clue => `
                <div class="cw-clue-item" data-dir="across" data-row="${clue.row}" data-col="${clue.col}" style="cursor:pointer; padding:3px 6px; border-radius:6px; line-height:1.3;">
                  <strong>${clue.num}A.</strong> ${clue.clue}
                </div>
              `).join('')}
            </div>
            <div id="cw-down-list" style="display:flex; flex-direction:column; gap:0.35rem;">
              ${down.map(clue => `
                <div class="cw-clue-item" data-dir="down" data-row="${clue.row}" data-col="${clue.col}" style="cursor:pointer; padding:3px 6px; border-radius:6px; line-height:1.3;">
                  <strong>${clue.num}D.</strong> ${clue.clue}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- On-Screen Virtual Keyboard -->
        <div id="cw-keyboard" style="display:flex; flex-direction:column; gap:5px; width:100%; max-width:440px; margin-top:0.25rem;">
          <div style="display:flex; justify-content:center; gap:4px;">
            ${['Q','W','E','R','T','Y','U','I','O','P'].map(k => `
              <button type="button" class="cw-key" data-key="${k}" style="flex:1; height:42px; border:none; border-radius:6px; background:#e2e8f0; font-weight:800; font-size:0.95rem; cursor:pointer;">${k}</button>
            `).join('')}
          </div>
          <div style="display:flex; justify-content:center; gap:4px;">
            ${['A','S','D','F','G','H','J','K','L'].map(k => `
              <button type="button" class="cw-key" data-key="${k}" style="flex:1; height:42px; border:none; border-radius:6px; background:#e2e8f0; font-weight:800; font-size:0.95rem; cursor:pointer;">${k}</button>
            `).join('')}
          </div>
          <div style="display:flex; justify-content:center; gap:4px;">
            <button type="button" class="cw-key-dir" id="cw-btn-switch-dir" style="flex:1.4; height:42px; border:none; border-radius:6px; background:#93c5fd; color:#1e3a8a; font-weight:800; font-size:0.8rem; cursor:pointer;">ACROSS</button>
            ${['Z','X','C','V','B','N','M'].map(k => `
              <button type="button" class="cw-key" data-key="${k}" style="flex:1; height:42px; border:none; border-radius:6px; background:#e2e8f0; font-weight:800; font-size:0.95rem; cursor:pointer;">${k}</button>
            `).join('')}
            <button type="button" class="cw-key-back" id="cw-btn-backspace" style="flex:1.4; height:42px; border:none; border-radius:6px; background:#cbd5e1; font-weight:800; font-size:1.1rem; cursor:pointer;">⌫</button>
          </div>
        </div>

      </div>
    `;

    const cellElements = container.querySelectorAll('.cw-cell');
    const bannerEl = container.querySelector('#cw-active-clue-banner');
    const clueBadgeEl = container.querySelector('#cw-clue-badge');
    const clueTextEl = container.querySelector('#cw-clue-text');
    const switchDirBtn = container.querySelector('#cw-btn-switch-dir');

    function updateHighlighting() {
      cellElements.forEach(cell => {
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);
        const isCurrent = (r === activeRow && c === activeCol);
        const isInWord = (activeDirection === 'across' && r === activeRow) ||
                         (activeDirection === 'down' && c === activeCol);

        if (isCurrent) {
          cell.style.background = '#fef08a'; // bright yellow active cell
          cell.style.boxShadow = '0 0 0 3px #f59e0b inset';
          cell.style.transform = 'scale(1.05)';
        } else if (isInWord) {
          cell.style.background = '#e0f2fe'; // soft blue word highlight
          cell.style.boxShadow = 'none';
          cell.style.transform = 'none';
        } else {
          cell.style.background = '#ffffff';
          cell.style.boxShadow = 'none';
          cell.style.transform = 'none';
        }
      });

      // Update Clue banner text
      let currentClue;
      if (activeDirection === 'across') {
        currentClue = across[activeRow];
        if (clueBadgeEl) clueBadgeEl.textContent = `${activeRow + 1}-ACROSS`;
        if (switchDirBtn) switchDirBtn.textContent = 'ACROSS';
      } else {
        currentClue = down[activeCol];
        if (clueBadgeEl) clueBadgeEl.textContent = `${activeCol + 1}-DOWN`;
        if (switchDirBtn) switchDirBtn.textContent = 'DOWN';
      }
      if (clueTextEl && currentClue) {
        clueTextEl.textContent = currentClue.clue;
      }

      // Highlight active clue in list
      container.querySelectorAll('.cw-clue-item').forEach(item => {
        const dir = item.dataset.dir;
        const r = parseInt(item.dataset.row, 10);
        const c = parseInt(item.dataset.col, 10);
        const isSelected = (dir === activeDirection) && 
                           ((dir === 'across' && r === activeRow) || (dir === 'down' && c === activeCol));
        item.style.background = isSelected ? '#dbeafe' : 'transparent';
        item.style.fontWeight = isSelected ? '800' : '500';
      });
    }

    function insertLetter(letter) {
      if (isFinished) return;
      userGrid[activeRow][activeCol] = letter.toUpperCase();
      const span = container.querySelector(`#cw-cell-${activeRow}-${activeCol}`);
      if (span) span.textContent = letter.toUpperCase();

      // Check for puzzle completion
      checkPuzzleComplete();

      // Move forward in current direction
      if (activeDirection === 'across') {
        if (activeCol < 4) {
          activeCol++;
        } else if (activeRow < 4) {
          activeRow++;
          activeCol = 0;
        }
      } else {
        if (activeRow < 4) {
          activeRow++;
        } else if (activeCol < 4) {
          activeCol++;
          activeRow = 0;
        }
      }
      updateHighlighting();
    }

    function handleBackspace() {
      if (isFinished) return;
      if (userGrid[activeRow][activeCol]) {
        userGrid[activeRow][activeCol] = '';
        const span = container.querySelector(`#cw-cell-${activeRow}-${activeCol}`);
        if (span) span.textContent = '';
      } else {
        // Move backward
        if (activeDirection === 'across') {
          if (activeCol > 0) activeCol--;
        } else {
          if (activeRow > 0) activeRow--;
        }
        userGrid[activeRow][activeCol] = '';
        const span = container.querySelector(`#cw-cell-${activeRow}-${activeCol}`);
        if (span) span.textContent = '';
      }
      updateHighlighting();
    }

    function toggleDirection() {
      activeDirection = activeDirection === 'across' ? 'down' : 'across';
      updateHighlighting();
    }

    function checkPuzzleComplete() {
      let isFull = true;
      let isAllCorrect = true;

      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          if (!userGrid[r][c]) {
            isFull = false;
          } else if (userGrid[r][c] !== grid[r][c]) {
            isAllCorrect = false;
          }
        }
      }

      if (isFull) {
        if (isAllCorrect) {
          isFinished = true;
          cellElements.forEach(cell => {
            cell.style.background = '#dcfce7'; // green
            cell.style.color = '#15803d';
          });
          const baseScore = puzzle.tier === 'easy' ? 400 : puzzle.tier === 'medium' ? 650 : 900;
          callbacks.showStatus('🎉 Spectacular! Crossword puzzle solved perfectly!', 'var(--correct-bg)');
          setTimeout(() => {
            callbacks.onWin(baseScore);
          }, 800);
        } else {
          callbacks.showStatus('⚠️ Some letters are incorrect. Review the clues!', '#ef4444');
        }
      }
    }

    // Grid Cell Click Listeners
    cellElements.forEach(cell => {
      cell.addEventListener('click', () => {
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);
        if (r === activeRow && c === activeCol) {
          toggleDirection();
        } else {
          activeRow = r;
          activeCol = c;
          updateHighlighting();
        }
      });
    });

    // Banner Click Listener
    bannerEl?.addEventListener('click', toggleDirection);
    switchDirBtn?.addEventListener('click', toggleDirection);

    // Clue Item Click Listeners
    container.querySelectorAll('.cw-clue-item').forEach(item => {
      item.addEventListener('click', () => {
        activeDirection = item.dataset.dir;
        activeRow = parseInt(item.dataset.row, 10);
        activeCol = parseInt(item.dataset.col, 10);
        updateHighlighting();
      });
    });

    // Keypad Click Listeners
    container.querySelectorAll('.cw-key').forEach(btn => {
      btn.addEventListener('click', () => {
        insertLetter(btn.dataset.key);
      });
    });

    container.querySelector('#cw-btn-backspace')?.addEventListener('click', handleBackspace);

    // Physical Keyboard Listener
    const handleKeyDown = (e) => {
      if (isFinished) return;
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        activeCol = Math.min(4, activeCol + 1);
        updateHighlighting();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        activeCol = Math.max(0, activeCol - 1);
        updateHighlighting();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeRow = Math.min(4, activeRow + 1);
        updateHighlighting();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeRow = Math.max(0, activeRow - 1);
        updateHighlighting();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleDirection();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        insertLetter(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    updateHighlighting();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  },
};
export default gameConfig;
