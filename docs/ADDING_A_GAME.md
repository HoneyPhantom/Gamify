# Adding a New Game to Gamify: Developer, Monetization & PR Guide

Gamify features a **zero-touch, plug-and-play modular game architecture** designed to maximize player retention, search engine indexing, and Google AdSense revenue. 

Adding a new game requires two components:
1. The interactive game logic module in `src/games/<game_id>.js`.
2. The dedicated static HTML page in `public/games/<game_id>.html` with desktop side ad rails and 250+ words of crawlable rules.

---

## 1. Google AdSense Monetization & Compliance Standards (Mandatory)

To maximize Google AdSense approval and CPM rates while adhering strictly to Google's Quality, Value Content, and Ad Placement guidelines, every contributed game **must** fulfill the following standards:

### A. Generic & Original Game Titles
- **No Trademarked Names**: Avoid trademarked or proprietary game titles. Use generic titles (e.g., use **"Word Guess"** instead of "Wordle", **"Classic Sudoku"**, **"Daily Crossword"**, **"Number Grid"**).
- Titles must be original, descriptive, and clearly communicate the logic puzzle mechanism.

### B. Dedicated Indexable URLs (`/games/<game_id>`)
- Every game has a dedicated, indexable URL (e.g., `https://gamify.com/games/word_guess`, `https://gamify.com/games/sudoku`).
- In addition to client-side routing, each game possesses a dedicated static file: `public/games/<game_id>.html`. Vite bundles and emits this directly into `dist/games/<game_id>.html`.

### C. Desktop Side Ads vs Mobile Top Ads (AdSense Policy Compliant)
- **Desktop Viewports ($\ge$ 960px)**: Advertisement banners are displayed on **side rails** (`.side-ad-rail`, minimum height 600px) on the left and right sides of the centered game launcher and arena, keeping the interactive game canvas completely unobstructed.
- **Mobile Viewports (< 960px)**: The side ad rails are hidden, and a responsive top ad banner (`.mobile-ad-banner`, minimum height 90px) is displayed above the game card.
- Every ad container is distinctly marked with the standard `ADVERTISEMENT` header label and layout shift reservations (`min-height`) to eliminate Cumulative Layout Shift (CLS).

### D. Mandatory 250+ Word Static Written Rules & Guide
- Search engine crawlers and automated AdSense evaluators index static HTML page text.
- Every game **must** provide at least **250+ words** of crawlable, static written instructions directly below the game canvas inside an HTML `<details open class="game-rules-dropdown">`:
  - **Section Title**: `## How to Play <Game Title> — Rules, Tips & Strategy`
  - **Objective**: Detailed summary of the puzzle goal.
  - **Color Code & Feedback Definitions**: Explicit explanations of deterministic cues (e.g. Green, Yellow, Gray).
  - **Controls**: Instructions for touch, mouse, and physical keyboard input.
  - **Analytical Strategy**: 2 to 3 paragraphs detailing tactical deduction methods (e.g., vowel anchors, orthogonal elimination, edge constraints).
  - **Escalating Hint Assistance & Coin Economy**: Explanation of the escalating hint cost mechanism.
- Include standard footer links: **About Us**, **Privacy Policy**, **Contact Us**, and **Terms of Service**.

---

## 2. Single Unified Escalating Hint Standard

- **Do NOT render a custom hint button inside your game board or canvas.** Redundant buttons clutter mobile viewports and confuse players.
- Gamify features a **single unified hint button** on the arena header control panel.
- When the player taps the hint button, Gamify verifies the user's coin balance, deducts escalating coins ($10 \to 20 \to 35 \to \dots$), and calls the `provideHint(cost)` function exported by your game's `mount()` return object:

```javascript
mount: (container, puzzle, callbacks) => {
  // ... game initialization ...

  const provideHint = (cost = 10) => {
    // 1. Reveal a correct cell or flash a matching element
    // 2. Add the .hinted-cell CSS class for glowing animation
    // 3. Display informative status
    callbacks.showStatus(`💡 Hint: Revealed cell! (-${cost} 🪙)`, "var(--accent)");
  };

  return {
    provideHint,
    cleanup: () => { /* remove event listeners */ }
  };
}
```

---

## 3. Deterministic PRNG & 100+ Days Randomness Standard

Gamify runs deterministically on client devices with zero server latency. Every player across the globe gets the exact same puzzle on any calendar day.

### Seed Requirements
- Import `SeededRNG` from `./prng.js`.
- Always seed daily puzzle generation with `${dateStr}:${gameId}:${tier}`:
  ```javascript
  import { SeededRNG } from './prng.js';

  const seed = `${dateStr}:sliding-puzzle:medium`;
  const rng = new SeededRNG(seed);
  ```
- The 32-bit FNV-1a hash inside `SeededRNG` produces an identical pseudorandom stream for all players on that calendar date.

### 100+ Days Randomness Guarantee
- The puzzle bank or procedural generator **must guarantee at least 100+ consecutive days of unique gameplay** without repeating puzzles.
- For procedural games (Sudoku, Number Grid, Number Trail, Memory Match), the combinatorial seed space provides billions of unique puzzles.
- For dictionary/grid games (Crossword, Word Guess), ensure the bank contains at least 100 verified entries across all tiers.

---

## 4. D1 Database Streak & Scoring Architecture

Gamify uses Cloudflare D1 SQL for lightning-fast leaderboard and streak tracking. The database schema stores:
- `current_streak`: Number of consecutive active days.
- `best_streak`: All-time highest streak achieved by the player.
- `last_played_date`: Calendar date (`YYYY-MM-DD` in UTC strict) of last completion.

### Streak Evaluation Rule:
- If `last_played_date === yesterday`: Consecutive day maintained $\to$ `current_streak + 1` and update `best_streak`.
- If `last_played_date === today`: Already played today $\to$ maintain current streak.
- If `last_played_date < yesterday`: Missed one or more days $\to$ `current_streak` resets to 1 upon solve (or evaluates to 0 for non-played days).

---

## 5. Game Module Implementation (`src/games/<your-game-id>.js`)

Create your game module in `src/games/`:
```bash
src/games/sliding-puzzle.js
```

### Complete Module Template:

```javascript
import { SeededRNG } from './prng.js';

export const gameConfig = {
  // 1. Unique game identifier (lowercase, hyphens allowed)
  id: "sliding-puzzle",

  // 2. URL slug (matches /games/:slug and public/games/:slug.html)
  slug: "sliding-puzzle",

  // 3. Display Metadata
  title: "Sliding Block Puzzle",
  description: "Rearrange the numbered tiles into numerical order with optimal sliding maneuvers.",
  icon: "🧩",

  // 4. Monetization & Base Unlock
  isFree: true,                // true = open to all; false = costs coins to unlock
  gameUnlockCost: 0,

  // 5. Difficulty Tier Generators (Deterministic Daily Puzzles)
  difficulties: {
    easy: {
      tier: "easy",
      unlockCost: 0,
      rewardCoins: 15,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:sliding-puzzle:easy`);
        return {
          gameId: "sliding-puzzle",
          difficulty: "easy",
          dateStr,
          gridSize: 3,
          initialBoard: [2, 1, 3, 4, 5, 6, 7, 8, null],
          targetBoard: [1, 2, 3, 4, 5, 6, 7, 8, null]
        };
      }
    },
    medium: {
      tier: "medium",
      unlockCost: 150,
      rewardCoins: 35,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:sliding-puzzle:medium`);
        return {
          gameId: "sliding-puzzle",
          difficulty: "medium",
          dateStr,
          gridSize: 4,
          initialBoard: generateShuffled(rng, 4),
          targetBoard: Array.from({ length: 15 }, (_, i) => i + 1).concat([null])
        };
      }
    },
    hard: {
      tier: "hard",
      unlockCost: 300,
      rewardCoins: 75,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:sliding-puzzle:hard`);
        return {
          gameId: "sliding-puzzle",
          difficulty: "hard",
          dateStr,
          gridSize: 5,
          initialBoard: generateShuffled(rng, 5),
          targetBoard: Array.from({ length: 24 }, (_, i) => i + 1).concat([null])
        };
      }
    }
  },

  // 6. Infinite Mode (Endless Practice)
  unlimitedPlayground: {
    tier: "playground",
    unlockCost: 250,
    generatePlaygroundPuzzle: (tier = 'medium') => {
      const rng = new SeededRNG(`sliding-${Date.now()}-${Math.random()}`);
      return {
        gameId: "sliding-puzzle",
        difficulty: tier,
        isPlayground: true,
        gridSize: 4,
        initialBoard: generateShuffled(rng, 4),
        targetBoard: Array.from({ length: 15 }, (_, i) => i + 1).concat([null])
      };
    }
  },

  // 7. Mount Lifecycle Method (Interactive Canvas)
  mount: (container, puzzle, { onWin, showStatus }) => {
    const startTime = Date.now();
    let isSolved = false;

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div id="puzzle-grid" style="display:grid; grid-template-columns:repeat(${puzzle.gridSize}, 56px); gap:6px;"></div>
      </div>
    `;

    // Single unified hint implementation
    const provideHint = (cost = 10) => {
      showStatus(`💡 Hint: Next correct tile indicated! (-${cost} 🪙)`, "var(--accent)");
    };

    return {
      provideHint,
      cleanup: () => {
        // remove event listeners and timers
      }
    };
  }
};
```

---

## 6. Dedicated Static HTML Template (`public/games/<game_id>.html`)

Create `public/games/<game_id>.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sliding Block Puzzle — Daily Logic Puzzle | Gamify</title>
  <meta name="description" content="Play the daily Sliding Block Puzzle on Gamify. Rearrange tiles into numerical order. Free, minimalist, and AdSense policy compliant." />
  <link rel="canonical" href="https://gamify.com/games/sliding_puzzle" />
  <link rel="stylesheet" href="/index.html" />
  <!-- Include game page side ads layout styles -->
</head>
<body>
  <!-- Header with Gamify logo & Home link -->
  <header class="site-header">
    <a href="/" class="brand-logo">🎮 <span class="logo-badge">Gamify</span></a>
    <a href="/" class="btn-nav-home">Home</a>
  </header>

  <!-- Desktop Side Ads Layout (Image 4) -->
  <div class="game-page-layout">
    <!-- Left Ad Rail -->
    <aside class="side-ad-rail" aria-label="Advertisement">
      <span class="ad-banner-label">Advertisement</span>
      <div class="ad-slot-box">Responsive Vertical Banner</div>
    </aside>

    <!-- Center Play Card & Static Rules -->
    <main class="game-main-content">
      <div class="mobile-ad-banner">
        <span class="ad-banner-label">Advertisement</span>
        <div class="mobile-ad-box"></div>
      </div>

      <div class="game-play-card">
        <h1>🧩 SLIDING BLOCK PUZZLE</h1>
        <p>Rearrange tiles into sequential order.</p>
        <a href="/?game=sliding-puzzle" class="btn-play-game">PLAY DAILY PUZZLE ▶</a>
      </div>

      <!-- 250+ Words Static Rules for AdSense Reviewers -->
      <details open class="game-rules-dropdown">
        <summary>📖 How to Play Sliding Block Puzzle — Rules & Strategy</summary>
        <div class="rules-body-content">
          <h4>Game Objective</h4>
          <p>Detailed explanation of puzzle mechanics...</p>
          <h4>Movement & Controls</h4>
          <p>Touch, mouse, and directional controls...</p>
          <h4>Proven Solving Strategies</h4>
          <p>Analytical deduction and row-by-row solving methods...</p>
          <h4>Escalating Hint Assistance & Coin Economy</h4>
          <p>Explanation of single hint button scaling from 10 coins...</p>
        </div>
      </details>
    </main>

    <!-- Right Ad Rail -->
    <aside class="side-ad-rail" aria-label="Advertisement">
      <span class="ad-banner-label">Advertisement</span>
      <div class="ad-slot-box">Responsive Vertical Banner</div>
    </aside>
  </div>

  <!-- Standard Policy Footer -->
  <footer class="site-footer">
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="/about.html">About Us</a>
      <a href="/privacy.html">Privacy Policy</a>
      <a href="/contact.html">Contact Us</a>
      <a href="/terms.html">Terms of Service</a>
    </div>
    <p>&copy; 2026 Gamify. All rights reserved.</p>
  </footer>
</body>
</html>
```

---

## 7. Step-by-Step GitHub Pull Request (PR) Workflow

To contribute your game to Gamify, follow these steps:

### Step 1: Fork & Clone Repository
```bash
git clone https://github.com/<your-username>/Gamify.git
cd Gamify
git checkout -b game/sliding-puzzle
```

### Step 2: Implement & Test
1. Add game logic to `src/games/<game_id>.js`.
2. Add static page to `public/games/<game_id>.html`.
3. Add static rules text to `src/client/gameRulesContent.js`.
4. Run locally:
   ```bash
   npm run dev
   ```

### Step 3: Run Full Production Verification
Ensure there are zero TypeScript, linting, or build errors:
```bash
npm run typecheck
npm run build
```
Verify that `dist/games/<game_id>.html` exists in the build output.

### Step 4: Commit with Semantic Message
```bash
git add src/games/sliding-puzzle.js public/games/sliding_puzzle.html src/client/gameRulesContent.js
git commit -m "feat(games): add sliding block puzzle with desktop side ads and 250+ word rules"
git push origin game/sliding-puzzle
```

### Step 5: Open GitHub Pull Request
1. Open a Pull Request against the `main` branch.
2. Confirm the PR Checklist:
   - [x] Non-trademarked generic title
   - [x] Deterministic daily seeds using `SeededRNG` (100+ days uniqueness)
   - [x] Single unified escalating hint (`provideHint`) implemented
   - [x] Dedicated static HTML page with desktop side ads (`public/games/<game_id>.html`)
   - [x] 250+ word crawlable written rules in `<details open class="game-rules-dropdown">`
   - [x] `npm run typecheck` and `npm run build` pass cleanly
3. Submit for automated review and deployment!
