# How to Add a New Game to Gamify

Gamify features a **zero-touch, plug-and-play game architecture**. When you add a new game, you **never** need to modify `app.js`, `index.html`, router endpoints, or database schemas. 

Vite's build system (`import.meta.glob`) automatically discovers your game, adds it to the homepage scrollable list, provisions its daily challenges, handles coin paywalls/unlocks, and hooks into leaderboards automatically.

---

## 3 Simple Steps to Add Your Game

1. **Create a file** in `src/games/`:
   `src/games/<your-game-id>.js` (e.g., `src/games/sudoku.js`).
2. **Export `gameConfig`** adhering to the standard schema (see format below).
3. **Run `npm run build`** (or test locally with `npm run dev`). Your game will instantly appear on the front page and in the game arena!

---

## Standard Game Module Format

Every game must export a `gameConfig` object with metadata, difficulty generators, and a `mount` lifecycle method:

```javascript
import { SeededRNG } from './prng.js';

export const gameConfig = {
  // 1. Unique game identifier (lowercase, hyphens allowed)
  id: "sudoku-mini",

  // 2. Display Name & UI Card Info
  title: "Mini Sudoku",
  description: "Fill the 4x4 grid with digits 1-4 without duplicates in rows, columns, or 2x2 boxes.",
  badge: "100 Coins to Unlock", // or "Free to Play"
  icon: "🧩",                  // Emoji or SVG icon

  // 3. Monetization & Paywall
  isFree: false,                // true = free for everyone; false = costs coins to unlock
  gameUnlockCost: 100,          // Coins required to unlock base game (if not free)

  // 4. Difficulty Tier Generators (Deterministic Daily Puzzles)
  difficulties: {
    easy: {
      tier: "easy",
      unlockCost: 50,
      rewardCoins: 15,
      generateDailyPuzzle: (dateStr) => {
        // Use SeededRNG with dateStr so every player gets the exact same puzzle today
        const rng = new SeededRNG(`${dateStr}:sudoku-mini:easy`);
        return {
          gameId: "sudoku-mini",
          difficulty: "easy",
          dateStr,
          gridSize: 4,
          initialBoard: [
            [1, null, 3, null],
            [null, 4, null, 2],
            [null, 2, null, 3],
            [4, null, 1, null]
          ],
          solution: [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
          ]
        };
      }
    },
    medium: {
      tier: "medium",
      unlockCost: 150,
      rewardCoins: 35,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:sudoku-mini:medium`);
        // Return medium puzzle...
        return { gameId: "sudoku-mini", difficulty: "medium", dateStr };
      }
    },
    hard: {
      tier: "hard",
      unlockCost: 300,
      rewardCoins: 75,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:sudoku-mini:hard`);
        // Return hard puzzle...
        return { gameId: "sudoku-mini", difficulty: "hard", dateStr };
      }
    }
  },

  // 5. Unlimited Playground Mode (Non-daily, endless practice)
  unlimitedPlayground: {
    tier: "playground",
    unlockCost: 500,
    generateRandomPuzzle: () => {
      // Return a newly randomized puzzle each time
      return { gameId: "sudoku-mini", difficulty: "playground" };
    }
  },

  // 6. Mount Lifecycle Method (Renders the game UI & controls)
  // container: HTML element where game renders
  // puzzle: The puzzle object returned by generateDailyPuzzle / generateRandomPuzzle
  // callbacks:
  //   - onWin(score, timeTakenMs): Call when player solves the puzzle.
  //   - showStatus(message, color): Update the status bar.
  //   - setRules(htmlString): Update the instructions footer.
  mount: (container, puzzle, { onWin, showStatus, setRules }) => {
    const startTime = Date.now();
    let isSolved = false;

    // Display rules & controls
    setRules(`
      <h3>Mini Sudoku Rules:</h3>
      <ul>
        <li>Fill in empty tiles with numbers 1 to 4.</li>
        <li>No duplicates in any row, column, or 2x2 quadrant.</li>
      </ul>
    `);

    showStatus("Solve the 4x4 Mini Sudoku", "var(--text-muted)");

    // Render HTML inside container
    container.innerHTML = `
      <div id="my-game-board" style="display:flex; flex-direction:column; align-items:center;">
        <div id="grid" style="display:grid; grid-template-columns: repeat(4, 50px); gap:6px;"></div>
        <button id="submit-btn" class="game-action-btn btn-play" style="margin-top:1rem; max-width:220px;">
          Check Solution ✓
        </button>
      </div>
    `;

    // (Add your game board cells and event listeners here)

    const checkBtn = container.querySelector('#submit-btn');
    const onCheck = () => {
      if (isSolved) return;

      // Verify player's answer:
      const won = true; // Replace with your check logic
      if (won) {
        isSolved = true;
        const timeTakenMs = Math.max(1500, Date.now() - startTime);
        const earnedPoints = 1200;

        showStatus(`🎉 Solved in ${(timeTakenMs / 1000).toFixed(1)}s! (+${earnedPoints} pts)`, "var(--correct-bg)");
        checkBtn.disabled = true;

        // Automatically triggers score sync, coins, streak rewards, and leaderboard!
        onWin(earnedPoints, timeTakenMs);
      } else {
        showStatus("❌ Incorrect solution. Try again!", "var(--danger)");
      }
    };

    checkBtn.addEventListener('click', onCheck);

    // Return a CLEANUP function (removes event listeners, intervals, keyboard listeners)
    return () => {
      checkBtn.removeEventListener('click', onCheck);
    };
  }
};
```

---

## What the Platform Handles Automatically

| Feature | Automated Behavior |
| :--- | :--- |
| **Front Page Discovery** | Game appears automatically in the horizontal scroll list with card icon, title, description, and status tag. |
| **Coin Paywall** | If `isFree: false`, users are prompted to unlock with `gameUnlockCost` coins. Once bought, unlocked state persists in D1 database. |
| **Tiers (Easy/Medium/Hard/Playground)** | Unlock costs (50/150/300/500 coins) and requirements are handled automatically. |
| **Daily Idempotent Rewards** | Calling `onWin(score, timeTakenMs)` automatically computes daily coin rewards (15/35/75 coins) and updates daily streak count. |
| **Live Leaderboards** | Today's best scores and all-time global leaderboard rankings are automatically calculated and updated on win. |
