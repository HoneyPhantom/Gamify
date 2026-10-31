import { SeededRNG } from './prng.js';

export const WORD_LIST = [
  // A
  "ABBEY","ABIDE","ABBOT","ABHOR","ABACK","ABLED","ABLER","AFOOT","AFTER","AGILE",
  "AGLOW","AGREE","AHEAD","AIDED","AISLE","ALARM","ALBUM","ALERT","ALLAY","ALLEY",
  "ALLOW","ALLOY","ALOFT","ALONE","ALONG","ALOUD","ALOOF","ALTER","ANGEL","ANGER",
  "ANGLE","ANGRY","ANIME","ANKLE","ANNEX","ANTIC","ANVIL","AORTA","APART","APPLE",
  "APRIL","APRON","APTLY","ARGON","ARISE","ARMED","ARMOR","AROSE","AROMA","ARRAY",
  "ARROW","ASKEW","ATLAS","ATONE","ATTIC","AUDIO","AUDIT","AVAIL","AVOID","AWAKE",
  "AWARD","AWARE","AWASH","AWFUL","AWOKE","AZURE",
  // B
  "BACON","BADGE","BADLY","BAGEL","BAGGY","BAKED","BAKER","BANAL","BANJO","BASIC",
  "BASIN","BATCH","BEACH","BEARD","BEAST","BEGIN","BEING","BELOW","BENCH","BEVEL",
  "BIRCH","BISON","BITER","BLAND","BLANK","BLAST","BLAZE","BLEAT","BLEED","BLEND",
  "BLESS","BLIMP","BLIND","BLINK","BLISS","BLOAT","BLOCK","BLOOD","BLOWN","BLUNT",
  "BOARD","BONUS","BOOST","BOOTH","BOUND","BRAIN","BRAND","BRAVE","BREAD","BREAK",
  "BREED","BRICK","BRIDE","BRIEF","BRINE","BRING","BRINK","BRISK","BROAD","BROKE",
  "BROOK","BROWN","BRUNT","BUDGE","BUGGY","BUILD","BUILT","BULGE","BUNCH","BURST",
  // C
  "CADET","CAMEL","CANDY","CARGO","CAROL","CATCH","CAUSE","CEDAR","CHAIR","CHALK",
  "CHAOS","CHARD","CHARM","CHART","CHASE","CHEAP","CHECK","CHEEK","CHESS","CHIDE",
  "CHIEF","CHILD","CHILL","CHIMP","CHOIR","CHORD","CHORE","CHUNK","CIVIC","CIVIL",
  "CLACK","CLAIM","CLAMP","CLASP","CLASS","CLAWS","CLEAN","CLEAR","CLERK","CLICK",
  "CLIFF","CLIMB","CLING","CLOAK","CLONE","CLOSE","CLOTH","CLOUD","CLOUT","CLOWN",
  "CLUMP","COACH","COAST","COBRA","COCOA","COMET","COMIC","COMMA","CORAL","COUGH",
  "COULD","COUNT","COVER","CRANE","CRASH","CREAK","CREEK","CREST","CRISP","CROSS",
  "CROWD","CROWN","CRUEL","CRUST","CRUSH","CRYPT","CUBIC","CUPID","CURED","CUTIE",
  // D
  "DAILY","DANCE","DAZED","DEALT","DEBUT","DECAY","DECOY","DEPOT","DERBY","DIGIT",
  "DIRGE","DIRTY","DISCO","DITCH","DIVER","DIZZY","DODGE","DOUGH","DOWDY","DRAFT",
  "DRAIN","DRAMA","DRAPE","DRAWL","DRAWN","DREAM","DREGS","DRIED","DRIFT","DRINK",
  "DROOP","DROVE","DROWN","DRYER","DUCHY","DULLY","DUNCE","DUSKY","DWARF","DWELL",
  // E
  "EAGER","EARLY","EARTH","EIGHT","EJECT","ELBOW","ELITE","EMBER","EMPTY","ENDED",
  "ENTER","ENVOY","EPOCH","EQUIP","ESSAY","EVADE","EVENT","EVERY","EXACT","EXCEL",
  "EXERT","EXILE","EXIST","EXPEL","EXTRA",
  // F
  "FABLE","FACED","FAITH","FALSE","FANCY","FATAL","FAULT","FEAST","FEMUR","FENCE",
  "FERRY","FETCH","FEVER","FIBRE","FIFTH","FIFTY","FIGHT","FINAL","FIRST","FIXED",
  "FIZZY","FJORD","FLACK","FLAME","FLANK","FLARE","FLASH","FLASK","FLEET","FLESH",
  "FLICK","FLING","FLINT","FLOAT","FLOCK","FLOOR","FLOUR","FLUID","FLUNK","FLUSH",
  "FOCAL","FOGGY","FOLLY","FORGE","FORAY","FORTE","FOUND","FRAIL","FRAME","FRANK",
  "FRAUD","FRESH","FRONT","FROST","FROWN","FRUIT","FUNGI","FUNNY","FURRY","FUZZY",
  // G
  "GAVEL","GAWKY","GECKO","GIDDY","GIRTH","GIVEN","GIZMO","GLAND","GLARE","GLASS",
  "GLAZE","GLEAM","GLIDE","GLINT","GLOAT","GLOBE","GLOOM","GLOSS","GLOVE","GLYPH",
  "GNOME","GOING","GRACE","GRADE","GRAFT","GRAIN","GRAND","GRANT","GRASP","GRAZE",
  "GREED","GREET","GRIEF","GRIME","GRIND","GROAN","GROIN","GROOM","GROPE","GROUT",
  "GROWL","GRUEL","GRUFF","GRUMP","GUARD","GUESS","GUILE","GUISE","GULCH","GUMMY",
  "GUSTO","GYPSY",
  // H
  "HABIT","HASTY","HATCH","HAUNT","HAVEN","HEIST","HENCE","HERBS","HINGE","HIPPO",
  "HOIST","HOUND","HOVER","HUMAN","HUMID","HURLS","HURRY","HYENA",
  // I
  "ICILY","ICING","IDEAL","IDIOM","IGLOO","IMPEL","INDEX","INERT","INFER","INNER",
  "INPUT","INTER","INURE","IRONY","ISSUE","IVORY",
  // J
  "JAUNT","JAZZY","JELLY","JEWEL","JIFFY","JOINT","JOKER","JOUST","JUMBO","JUMPY",
  "JUICY","JUROR",
  // K
  "KAYAK","KAZOO","KEBAB","KNACK","KNAVE","KNEEL","KNELT","KNIFE","KNOBS","KNOCK",
  "KNOLL","KNOTS","KNOWN",
  // L
  "LABEL","LANCE","LANKY","LARGE","LATCH","LATER","LATHE","LEAFY","LEAKY","LEAPT",
  "LEARN","LEASH","LEAST","LEAVE","LEDGE","LEGAL","LEACH","LEMON","LEVEL","LIGHT",
  "LIMBO","LINER","LIVER","LOCAL","LODGE","LOGIC","LOOSE","LOTTO","LOUSY","LOVER",
  "LOWER","LOWLY","LUCID","LUCKY","LUMEN","LUMPY","LUNAR","LUSTY","LYING",
  // M
  "MAGIC","MAJOR","MAPLE","MARCH","MARSH","MATCH","MERCY","MERIT","METAL","MIGHT",
  "MINCE","MINOR","MINUS","MIRTH","MISER","MIXED","MOCHA","MODEL","MONEY","MONKS",
  "MOODY","MORAL","MOULD","MOURN","MOUTH","MOVER","MUDDY","MULCH","MURKY","MUTED",
  "MYRRH","MYTHS",
  // N
  "NAIVE","NASTY","NAVAL","NEEDY","NERVE","NEVER","NIGHT","NOBLE","NOISY","NONCE",
  "NOTCH","NOVEL","NURSE","NUTTY","NYMPH",
  // O
  "OCCUR","OCEAN","OFFER","OLIVE","ONION","OPTIC","ORBIT","ORDER","OTHER","OTTER",
  "OUGHT","OUTER","OUTDO","OVERT","OXIDE",
  // P
  "PANIC","PAPAL","PARKS","PASTE","PATCH","PAUSE","PEACE","PEACH","PEDAL","PENAL",
  "PERCH","PHASE","PHOTO","PIANO","PIXEL","PINCH","PIZZA","PLACE","PLAID","PLAIN",
  "PLANE","PLANK","PLANT","PLAZA","PLEAD","PLUCK","PLUMB","PLUME","PLUMP","PLUNK",
  "PLUSH","POINT","POLAR","POPPY","PORCH","POWER","PRESS","PRICE","PRICK","PRIME",
  "PRIMP","PRIZE","PROBE","PRONE","PROOF","PROSE","PROUD","PROVE","PROWL","PRUDE",
  "PRUNE","PSALM","PUBIC","PULSE","PUNCH","PUPIL","PURSE","PUSHY",
  // Q
  "QUACK","QUALM","QUART","QUASH","QUASI","QUEEN","QUERY","QUEST","QUEUE","QUICK",
  "QUIET","QUOTA","QUOTE","QUIRK",
  // R
  "RABID","RADAR","RADIO","RAINY","RALLY","RANCH","RANGE","RAPID","RATIO","REACT",
  "REALM","REBUT","REFER","REIGN","RELAX","REMIX","REPAY","REPEL","REPOT","RIDER",
  "RIDGE","RIFLE","RIGHT","RIGID","RIGOR","RINSE","RISEN","RISKY","RIVAL","RIVER",
  "ROBIN","ROCKY","ROUGE","ROUGH","ROUND","ROUTE","ROVER","ROWDY","ROYAL","RUGBY",
  "RULER","RUSTY",
  // S
  "SABOT","SAINT","SALSA","SALVE","SANDY","SAUCE","SAVOR","SAVVY","SCALE","SCALP",
  "SCARF","SCARY","SCENE","SCONE","SCOOP","SCOPE","SCORE","SCOUT","SCOWL","SCRAM",
  "SEDAN","SEIZE","SENSE","SERUM","SETUP","SEVEN","SHARD","SHARE","SHAFT","SHAKE",
  "SHAKY","SHALE","SHALL","SHAME","SHAPE","SHANK","SHARK","SHAWL","SHEAF","SHEEN",
  "SHEEP","SHEER","SHELF","SHELL","SHIFT","SHORE","SHORT","SHOUT","SHOVE","SHOWN",
  "SHOWY","SHRUB","SIEGE","SIGMA","SILLY","SINCE","SIXTH","SIXTY","SIZED","SKILL",
  "SKIMP","SKULL","SLACK","SLAIN","SLANT","SLASH","SLATE","SLEEK","SLEET","SLICK",
  "SLIDE","SLIME","SLIMY","SLOTH","SLUMP","SLUNK","SMART","SMASH","SMELL","SMELT",
  "SMILE","SMIRK","SMITE","SMOKE","SNACK","SNAIL","SNAKE","SNARE","SNARL","SNEAK",
  "SNEER","SNIDE","SNIFF","SNORE","SNORT","SOGGY","SOLAR","SOLID","SOLVE","SONIC",
  "SOUTH","SPADE","SPARE","SPARK","SPAWN","SPEAK","SPEAR","SPECK","SPEED","SPELL",
  "SPEND","SPICE","SPILL","SPINE","SPITE","SPOIL","SPOKE","SPOOK","SPOON","SPORE",
  "SPORT","SPOUT","SPREE","SQUAD","SQUAT","SQUID","STAIN","STAIR","STAKE","STALE",
  "STALL","STAMP","STAND","STARK","START","STASH","STATE","STEAD","STEAM","STEEL",
  "STEEP","STEER","STICK","STIFF","STILL","STING","STOCK","STOIC","STONE","STORE",
  "STORK","STORM","STORY","STOUT","STRUT","STUCK","STUDY","STUMP","STUNG","STUNT",
  "SUAVE","SUGAR","SUITE","SULKY","SWAMP","SWEAR","SWEAT","SWEEP","SWEET","SWEPT",
  "SWIFT","SWILL","SWIPE","SWIRL","SWORD","SWORN",
  // T
  "TABLE","TAUNT","TENSE","TEPID","THANK","THEIR","THEFT","THEME","THINK","THORN",
  "THOSE","THREE","THREW","THROW","THUMB","THUMP","TIGER","TIGHT","TILTS","TIMID",
  "TIPSY","TIRED","TOAST","TOKEN","TONIC","TOPER","TOTAL","TOUCH","TOUGH","TOWER",
  "TOXIC","TRACE","TRACK","TRADE","TRAIL","TRAMP","TRASH","TREAD","TRESS","TREND",
  "TRICK","TRIED","TRITE","TROOP","TROTH","TROUT","TROVE","TRUCE","TRUNK","TRUST",
  "TRUTH","TUBER","TULIP","TUMOR","TUNER","TUNIC","TWIST","TYING",
  // U
  "UDDER","ULTRA","UNCLE","UNCUT","UNDER","UNIFY","UNION","UNITE","UNITY","UNTIL",
  "UPPER","UPSET","USHER","USUAL","UTTER",
  // V
  "VAGUE","VALID","VAPID","VAULT","VICAR","VIDEO","VIGOR","VIRAL","VIRUS","VISOR",
  "VISTA","VITAL","VIVID","VOCAL","VODKA","VOICE","VOILA","VOMIT","VOTER",
  // W
  "WAGER","WASTE","WATCH","WEDGE","WEIRD","WHACK","WHARF","WHEAT","WHEEL","WHERE",
  "WHICH","WHIFF","WHILE","WHIRL","WHITE","WHOLE","WIELD","WINDY","WITCH","WITTY",
  "WOKEN","WOMAN","WOMEN","WORLD","WORRY","WORTH","WOUND","WRATH","WRIST","WRONG",
  // Y
  "YACHT","YEARN","YIELD","YOUNG","YOUTH","YUMMY",
  // Z
  "ZEBRA","ZESTY","ZILCH","ZIPPY","ZONAL"
];


export const KB_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"]
];

/**
 * Validates a 5-letter guess against a target word.
 * Returns array of statuses: ['correct', 'present', 'absent', ...]
 */
export function evaluateWordleGuess(guess, targetWord) {
  const targetArr = targetWord.split("");
  const result = Array(5).fill("absent");
  const letterCounts = {};

  for (const char of targetArr) {
    letterCounts[char] = (letterCounts[char] || 0) + 1;
  }

  // First pass: mark correct positions
  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetArr[i]) {
      result[i] = "correct";
      letterCounts[guess[i]]--;
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < 5; i++) {
    if (result[i] !== "correct" && letterCounts[guess[i]] > 0) {
      result[i] = "present";
      letterCounts[guess[i]]--;
    }
  }

  return result;
}

export const gameConfig = {
  id: "wordle",
  slug: "word-guess",
  title: "Word Guess",
  description: "Deduce the secret 5-letter mystery word within 6 strategic guesses.",
  badge: "Free to Play",
  icon: "🔤",
  thumbnail: "/images/word-guess.png",
  isFree: true,
  gameUnlockCost: 0,
  difficulties: {
    easy: {
      tier: "easy",
      unlockCost: 50,
      rewardCoins: 15,
      maxAttempts: 6,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:wordle:easy`);
        const wordIndex = rng.nextInt(0, WORD_LIST.length - 1);
        return {
          gameId: "wordle",
          difficulty: "easy",
          dateStr,
          wordLength: 5,
          maxAttempts: 6,
          targetWord: WORD_LIST[wordIndex]
        };
      }
    },
    medium: {
      tier: "medium",
      unlockCost: 150,
      rewardCoins: 35,
      maxAttempts: 5, // 5 attempts for medium
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:wordle:medium`);
        const wordIndex = rng.nextInt(0, WORD_LIST.length - 1);
        return {
          gameId: "wordle",
          difficulty: "medium",
          dateStr,
          wordLength: 5,
          maxAttempts: 5,
          targetWord: WORD_LIST[wordIndex]
        };
      }
    },
    hard: {
      tier: "hard",
      unlockCost: 300,
      rewardCoins: 75,
      maxAttempts: 4, // 4 attempts for hard
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:wordle:hard`);
        const wordIndex = rng.nextInt(0, WORD_LIST.length - 1);
        return {
          gameId: "wordle",
          difficulty: "hard",
          dateStr,
          wordLength: 5,
          maxAttempts: 4,
          targetWord: WORD_LIST[wordIndex]
        };
      }
    }
  },
  unlimitedPlayground: {
    tier: "playground",
    unlockCost: 0,
    generateRandomPuzzle: (prevWord) => {
      let pool = WORD_LIST;
      if (prevWord && pool.length > 1) {
        pool = pool.filter(w => w !== prevWord);
      }
      const randomWord = pool[Math.floor(Math.random() * pool.length)];
      return {
        gameId: "wordle",
        difficulty: "playground",
        wordLength: 5,
        maxAttempts: 6,
        targetWord: randomWord
      };
    }
  },
  mount: (container, puzzle, { onWin, showStatus, setRules }) => {
    const targetWord = puzzle.targetWord;
    const maxAttempts = puzzle.maxAttempts || 6;
    const startTime = Date.now();
    let currentRow = 0;
    let currentCol = 0;
    const guesses = Array(maxAttempts).fill("").map(() => Array(5).fill(""));
    const guessHistory = []; // Tracks result statuses per row for share grid
    let isGameOver = false;

    showStatus(`Attempt 1 of ${maxAttempts}`, "var(--text-muted)");

    setRules(`
      <h3>Word Guess Rules & Scoring:</h3>
      <ul>
        <li>Guess the 5-letter word in <strong>${maxAttempts} attempts</strong>.</li>
        <li><strong>Scoring:</strong> 1st try = 600 pts, 2nd = 500, 3rd = 400, 4th = 300, 5th = 200, 6th = 100.</li>
        <li><span style="color:var(--correct-bg); font-weight:bold;">Green:</span> Correct letter and spot.</li>
        <li><span style="color:var(--present-bg); font-weight:bold;">Yellow:</span> Letter is in the word but wrong spot.</li>
        <li><span style="color:var(--text-muted); font-weight:bold;">Dark:</span> Letter is not in the word.</li>
      </ul>
    `);

    container.innerHTML = `
      <div id="wordle-board" class="board" style="grid-template-rows: repeat(${maxAttempts}, 1fr);"></div>
      <div id="wordle-keyboard" class="keyboard"></div>
    `;

    const board = container.querySelector('#wordle-board');
    const kb = container.querySelector('#wordle-keyboard');

    function updateCursor() {
      container.querySelectorAll('.cell.active-cursor').forEach(el => el.classList.remove('active-cursor'));
      if (!isGameOver && currentRow < maxAttempts) {
        const activeCol = Math.min(Math.max(0, currentCol), 4);
        const activeCell = container.querySelector(`#wordle-cell-${currentRow}-${activeCol}`);
        if (activeCell) activeCell.classList.add('active-cursor');
      }
    }

    function renderBoard() {
      board.innerHTML = "";
      for (let r = 0; r < maxAttempts; r++) {
        const rowEl = document.createElement("div");
        rowEl.className = "row";
        for (let c = 0; c < 5; c++) {
          const cellEl = document.createElement("div");
          cellEl.className = "cell";
          cellEl.id = `wordle-cell-${r}-${c}`;
          cellEl.innerText = guesses[r][c] || "";
          cellEl.addEventListener("click", () => {
            if (!isGameOver && r === currentRow) {
              currentCol = c;
              updateCursor();
            }
          });
          rowEl.appendChild(cellEl);
        }
        board.appendChild(rowEl);
      }
      updateCursor();
    }

    function renderKeyboard() {
      kb.innerHTML = "";
      KB_ROWS.forEach(row => {
        const rowEl = document.createElement("div");
        rowEl.className = "kb-row";
        row.forEach(key => {
          const btn = document.createElement("button");
          btn.className = "key";
          btn.id = `wordle-key-${key}`;
          btn.innerText = key === "DELETE" ? "⌫" : key;
          if (key === "ENTER" || key === "DELETE") {
            btn.classList.add("wide");
          }
          btn.addEventListener("click", () => handleInput(key));
          rowEl.appendChild(btn);
        });
        kb.appendChild(rowEl);
      });
    }

    function handleInput(key) {
      if (isGameOver) return;
      if (key === "ENTER") {
        submitGuess();
      } else if (key === "DELETE" || key === "BACKSPACE") {
        if (currentCol > 0) {
          currentCol--;
          guesses[currentRow][currentCol] = "";
          const cell = container.querySelector(`#wordle-cell-${currentRow}-${currentCol}`);
          if (cell) cell.innerText = "";
          updateCursor();
        }
      } else if (/^[A-Z]$/.test(key)) {
        if (currentCol < 5 && currentRow < maxAttempts) {
          guesses[currentRow][currentCol] = key;
          const cell = container.querySelector(`#wordle-cell-${currentRow}-${currentCol}`);
          if (cell) {
            cell.innerText = key;
            cell.classList.add("pop");
            setTimeout(() => cell.classList.remove("pop"), 100);
          }
          currentCol++;
          updateCursor();
        }
      }
    }

    function submitGuess() {
      if (currentCol < 5) {
        showStatus("Word must be 5 letters!", "var(--danger)");
        return;
      }

      const guess = guesses[currentRow].join("");
      const result = evaluateWordleGuess(guess, targetWord);

      for (let i = 0; i < 5; i++) {
        const cell = container.querySelector(`#wordle-cell-${currentRow}-${i}`);
        const letter = guess[i];
        const statusClass = result[i];
        if (cell) cell.classList.add(statusClass);

        const keyBtn = container.querySelector(`#wordle-key-${letter}`);
        if (keyBtn) {
          if (statusClass === "correct") {
            keyBtn.className = "key correct";
          } else if (statusClass === "present" && !keyBtn.classList.contains("correct")) {
            keyBtn.className = "key present";
          } else if (statusClass === "absent" && !keyBtn.classList.contains("correct") && !keyBtn.classList.contains("present")) {
            keyBtn.className = "key absent";
          }
        }
      }

      // Track this row's result for share grid
      guessHistory.push(result);

      if (guess === targetWord) {
        const earnedPoints = (maxAttempts - currentRow) * 100;
        showStatus(`🎉 Solved in ${currentRow + 1} tries! (+${earnedPoints} pts)`, "var(--correct-bg)");
        isGameOver = true;
        updateCursor();
        const timeTakenMs = Math.max(1500, Date.now() - startTime);
        onWin(earnedPoints, timeTakenMs, { wordleTries: currentRow + 1 });

        // Show share button below the board
        showShareButton(currentRow + 1, maxAttempts, puzzle);
        return;
      }

      currentRow++;
      currentCol = 0;
      updateCursor();

      if (currentRow >= maxAttempts) {
        showStatus(`Game Over! Word was: ${targetWord}`, "var(--danger)");
        isGameOver = true;
        updateCursor();
      } else {
        showStatus(`Attempt ${currentRow + 1} of ${maxAttempts}`, "var(--text-muted)");
      }
    }

    function showShareButton(triesUsed, maxTries, puzz) {
      // Remove any existing share button
      container.querySelector('#wordle-share-btn')?.remove();

      const shareBtn = document.createElement('button');
      shareBtn.id = 'wordle-share-btn';
      shareBtn.className = 'wordle-share-btn';
      shareBtn.innerHTML = '📋 Share Result';

      shareBtn.addEventListener('click', () => {
        const emojiMap = { correct: '🟩', present: '🟨', absent: '⬛' };
        const grid = guessHistory.map(row =>
          row.map(s => emojiMap[s] || '⬛').join('')
        ).join('\n');

        const diffLabel = puzz.difficulty !== 'playground'
          ? `${puzz.difficulty.charAt(0).toUpperCase() + puzz.difficulty.slice(1)}`
          : 'Playground';
        const dateLabel = puzz.dateStr || '';

        const shareText = [
          `🎮 Gamify Word Guess (${diffLabel}${dateLabel ? ' · ' + dateLabel : ''})`,
          `${triesUsed}/${maxTries}`,
          '',
          grid,
          '',
          '🔗 gamify.pages.dev'
        ].join('\n');

        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(shareText).then(() => {
            shareBtn.innerHTML = '✅ Copied!';
            setTimeout(() => { shareBtn.innerHTML = '📋 Share Result'; }, 2000);
          }).catch(() => {
            prompt('Copy this result:', shareText);
          });
        } else {
          prompt('Copy this result:', shareText);
        }
      });

      // Insert after the board
      const boardEl = container.querySelector('#wordle-board');
      if (boardEl?.parentNode) {
        boardEl.parentNode.insertBefore(shareBtn, boardEl.nextSibling);
      }
    }

    const onKeydown = (e) => {
      const key = e.key.toUpperCase();
      if (key === "ENTER" || key === "BACKSPACE" || /^[A-Z]$/.test(key)) {
        handleInput(key);
      }
    };
    window.addEventListener("keydown", onKeydown);

    renderBoard();
    renderKeyboard();

    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }
};

