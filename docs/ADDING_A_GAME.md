# Adding a New Game to Gamify: Developer & Monetization Guide

Gamify features a **zero-touch, plug-and-play modular game architecture**. Adding a new game requires no changes to core routing, database schemas, or worker endpoints. Vite dynamically bundles all modules placed in `src/games/`, provisions daily challenges, attaches live leaderboards, and integrates seamlessly into our Google AdSense monetization system.

---

## 1. Google AdSense Monetization & Compliance Standards (Mandatory)

To maximize Google AdSense revenue and adhere strictly to Google's Quality & Value Content guidelines, every contributed game **must** fulfill the following standards:

### A. Generic & Original Game Titles
- **No Trademarked Names**: Avoid trademarked or proprietary game titles (e.g., use **"Word Guess"** instead of "Wordle", **"Classic Sudoku"**, **"Daily Crossword"**).
- Titles must be original, descriptive, and clearly communicate the logic gameplay mechanism to players and search crawler algorithms.

### B. Mandatory 250+ Word Static Written Rules & Guide
- Search engine crawlers and automated AdSense evaluators index static page content heavily.
- Every game **must** provide at least **250+ words** of crawlable, static written instructions in `src/client/gameRulesContent.js`.
- Rules are rendered directly below the game canvas in an HTML `<details>` and `<summary>` collapsible card:
  - **Section Title**: `## How to Play <Game Title>`
  - **Color Code Definitions**: Clear explanation of tile feedback (e.g., Green/Yellow/Grey, Active/Complete).
  - **Movement & Controls**: Explaining mouse, touch, and physical keyboard shortcuts.
  - **Strategies & Tactics**: 2 to 3 paragraphs detailing analytical deduction methods (e.g., candidate elimination, cross-hatching, vowel anchors).
  - **Scoring & Streak Bonuses**: Point breakdowns, speed bonus thresholds, and streak progression.

### C. Dedicated Clean URL Routing (`/games/:slug`)
- Each game runs in its own dedicated, canonical URL (e.g., `https://gamify.top/games/sudoku`, `https://gamify.top/games/word-guess`).
- The game view includes breadcrumb navigation (`Home › <Game Name>`), unique `<title>` metadata, and dedicated above-and-below AdSense responsive ad slots.

### D. Ad Layout & Cumulative Layout Shift (CLS) Protection
- Ad banner slots feature a minimum height reservation (`min-height: 90px` or `min-height: 250px`) with the required `ADVERTISEMENT` header label.
- Never place interactive game buttons or inputs immediately flush against ad wrappers to avoid accidental invalid clicks.

---

## 2. Deterministic PRNG & 100+ Days Randomness Standard

Gamify runs deterministically on client devices with zero server latency. Every player across the globe gets the exact same puzzle on any calendar day.

### Seed Requirements
- Import `SeededRNG` from `./prng.js`.
- Always seed daily puzzle generation with `${dateStr}:${gameId}:${tier}`:
  ```javascript
  import { SeededRNG } from './prng.js';

  const seed = `${dateStr}:my-game:medium`;
  const rng = new SeededRNG(seed);
  ```
- The 32-bit FNV-1a hash inside `SeededRNG` produces an identical pseudorandom stream for all players on that calendar date.

### 100+ Days Randomness Guarantee
- The puzzle bank or procedural generator **must guarantee at least 100+ consecutive days of unique gameplay** without repeating puzzles.
- For procedural games (e.g., Sudoku, Number Grid, Number Trail, Memory Match), the combinatorial seed space provides billions of unique puzzles.
- For curated dictionary/grid games (e.g., Crossword, Word Guess), ensure the bank contains at least 100 verified entries across all tiers.

---

## 3. Game Module Implementation (`src/games/<your-game-id>.js`)

Create a new JavaScript file in `src/games/`:
```bash
src/games/sliding-puzzle.js
```

### Complete Code Template

```javascript
import { SeededRNG } from './prng.js';

export const gameConfig = {
  // 1. Unique game identifier (lowercase, hyphens allowed)
  id: "sliding-puzzle",

  // 2. URL slug (used for clean routing /games/:slug)
  slug: "sliding-puzzle",

  // 3. Display Metadata
  title: "Sliding Block Puzzle",
  description: "Rearrange the numbered tiles into numerical order with optimal sliding maneuvers.",
  icon: "🧩",

  // 4. Monetization & Base Unlock
  isFree: true,                // true = open to all; false = costs coins to unlock base game
  gameUnlockCost: 0,           // Coins required if isFree: false (e.g., 100)

  // 5. Difficulty Tier Generators (Deterministic Daily Puzzles)
  difficulties: {
    easy: {
      tier: "easy",
      unlockCost: 0,           // Free by default
      rewardCoins: 15,         // Base daily coin reward
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:sliding-puzzle:easy`);
        return {
          gameId: "sliding-puzzle",
          difficulty: "easy",
          dateStr,
          gridSize: 3,
          movesLimit: 40,
          initialBoard: generateShuffledBoard(rng, 3, 15),
          targetBoard: [1, 2, 3, 4, 5, 6, 7, 8, null]
        };
      }
    },
    medium: {
      tier: "medium",
      unlockCost: 150,         // Coins to unlock medium tier
      rewardCoins: 35,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:sliding-puzzle:medium`);
        return {
          gameId: "sliding-puzzle",
          difficulty: "medium",
          dateStr,
          gridSize: 4,
          movesLimit: 80,
          initialBoard: generateShuffledBoard(rng, 4, 30),
          targetBoard: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null]
        };
      }
    },
    hard: {
      tier: "hard",
      unlockCost: 300,         // Coins to unlock hard tier
      rewardCoins: 75,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:sliding-puzzle:hard`);
        return {
          gameId: "sliding-puzzle",
          difficulty: "hard",
          dateStr,
          gridSize: 5,
          movesLimit: 120,
          initialBoard: generateShuffledBoard(rng, 5, 60),
          targetBoard: Array.from({ length: 24 }, (_, i) => i + 1).concat([null])
        };
      }
    }
  },

  // 6. Infinite Mode (Endless Practice without waiting for UTC reset)
  unlimitedPlayground: {
    tier: "playground",
    unlockCost: 500,           // One-time coin payment unlocks infinite mode for all unlocked tiers
    generatePlaygroundPuzzle: (tier = 'medium') => {
      const rng = new SeededRNG(`sliding-play-${Date.now()}-${Math.random()}`);
      const size = tier === 'easy' ? 3 : tier === 'hard' ? 5 : 4;
      return {
        gameId: "sliding-puzzle",
        difficulty: tier,
        isPlayground: true,
        gridSize: size,
        initialBoard: generateShuffledBoard(rng, size, size * 10),
        targetBoard: Array.from({ length: size * size - 1 }, (_, i) => i + 1).concat([null])
      };
    }
  },

  // 7. Mount Lifecycle Method (UI Rendering & Interaction)
  // container: DOM element where the game canvas is mounted
  // puzzle: The puzzle object returned by generateDailyPuzzle / generatePlaygroundPuzzle
  // callbacks:
  //   - onWin(score, timeTakenMs): Submit solve to sync streak, coins, and leaderboards
  //   - showStatus(message, color): Update status banner
  mount: (container, puzzle, { onWin, showStatus }) => {
    const startTime = Date.now();
    let isSolved = false;

    // Render game board HTML inside container
    container.innerHTML = `
      <div class="sliding-game-wrapper" style="display:flex; flex-direction:column; align-items:center;">
        <div id="sliding-board" style="display:grid; grid-template-columns: repeat(${puzzle.gridSize}, 60px); gap:6px;"></div>
        <button id="btn-check-sliding" class="game-action-btn btn-play" style="margin-top:1.25rem;">
          Verify Order ✓
        </button>
      </div>
    `;

    const boardEl = container.querySelector('#sliding-board');
    const verifyBtn = container.querySelector('#btn-check-sliding');

    // (Add interactive tile click listeners here...)

    const handleVerify = () => {
      if (isSolved) return;
      
      const won = checkIsSolved(puzzle); // Implement your verification
      if (won) {
        isSolved = true;
        const timeTakenMs = Math.max(1200, Date.now() - startTime);
        const earnedPoints = calculateScore(timeTakenMs);

        showStatus(`🎉 Solved in ${(timeTakenMs / 1000).toFixed(1)}s! (+${earnedPoints} pts)`, "var(--correct-bg)");
        verifyBtn.disabled = true;

        // Triggers optimistic coin reward, streak maintenance, confetti, and leaderboard sync
        onWin(earnedPoints, timeTakenMs);
      } else {
        showStatus("❌ Tiles are not yet in sequential order. Keep sliding!", "var(--danger)");
      }
    };

    verifyBtn.addEventListener('click', handleVerify);

    // Return a CLEANUP function (removes event listeners, timers, intervals)
    return () => {
      verifyBtn.removeEventListener('click', handleVerify);
    };
  }
};
```

---

## 4. Registering Static Written Rules in `src/client/gameRulesContent.js`

Open `src/client/gameRulesContent.js` and add an entry matching your game ID:

```javascript
export const STATIC_GAME_RULES = {
  // ... existing games ...

  'sliding-puzzle': {
    gameId: 'sliding-puzzle',
    slug: 'sliding-puzzle',
    title: 'How to Play Sliding Block Puzzle',
    wordCount: 310,
    html: `
      <h3>Goal and Spatial Sliding Overview</h3>
      <p>Sliding Block Puzzle is an engaging spatial deduction puzzle where your objective is to rearrange a scrambled grid of numbered square tiles into strictly ascending numerical order (from 1 to N) with the empty slot finishing in the bottom-right corner.</p>

      <h3>Rules and Movement Constraints</h3>
      <ul>
        <li><strong>Orthogonal Slides:</strong> You may only slide tiles into the adjacent empty vacant space vertically or horizontally.</li>
        <li><strong>No Lifting or Teleporting:</strong> Tiles cannot jump over other tiles; each move must be a direct slide into the adjacent open slot.</li>
      </ul>

      <h3>Controls and Touch Feedback</h3>
      <p>Click or tap any tile adjacent to the empty space to slide it instantly. On mobile devices, smooth CSS transitions guide the movement with haptic visual feedback.</p>

      <h3>Proven Solving Strategies</h3>
      <p>Solve the top row first, from left to right. Once the first row is locked in place, never disturb it. Continue row by row downwards until only the final two rows remain. Use corner rotation algorithms to rotate the last three numbers into their target positions without breaking previous rows.</p>

      <h3>Scoring, Speed Bonuses & Daily Streaks</h3>
      <p>Completing daily puzzles with fewer moves and swift times awards bonus points (+50, +25, +10 Pts). Consecutive daily solves build active streaks that yield bonus coins!</p>
    `
  }
};
```

---

## 5. Step-by-Step GitHub Pull Request (PR) Workflow

To contribute your new game to the official Gamify repository, follow this workflow:

### Step 1: Fork and Clone
```bash
git clone https://github.com/<your-username>/Gamify.git
cd Gamify
git checkout -b game/sliding-puzzle
```

### Step 2: Implement and Test Locally
1. Add your game module to `src/games/<gameId>.js`.
2. Add your 250+ word static guide to `src/client/gameRulesContent.js`.
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Test all three difficulties (Easy, Medium, Hard), test Infinite Mode, and verify the rules dropdown renders neatly below the board.

### Step 3: Run Full Production Verification
Ensure there are no build or TypeScript errors:
```bash
npm run typecheck
npm run build
```
The build must succeed with zero errors and clean output chunks.

### Step 4: Commit with Semantic Messages
```bash
git add src/games/sliding-puzzle.js src/client/gameRulesContent.js
git commit -m "feat(games): add sliding block puzzle with deterministic daily seeds and 250+ word guide"
git push origin game/sliding-puzzle
```

### Step 5: Submit Pull Request on GitHub
1. Navigate to `https://github.com/your-org/Gamify/pulls`.
2. Click **New Pull Request**.
3. Use the PR template checklist:
   - [x] Non-trademarked generic title
   - [x] Deterministic daily seeds using `SeededRNG`
   - [x] 100+ days randomness guarantee
   - [x] 250+ word crawlable written rules in `src/client/gameRulesContent.js`
   - [x] `npm run typecheck` and `npm run build` pass cleanly
   - [x] Responsive layout tested on desktop and mobile viewports
4. Submit your PR for review! Our automated CI will run checks and preview deployment.
