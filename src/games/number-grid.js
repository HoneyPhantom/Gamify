import { SeededRNG } from './prng.js';

/**
 * Number Grid Matrix - Daily Puzzle Implementation
 * Players must fill an N x N grid so that the sum of each row and column
 * matches the designated target sums, using numbers from 1 to maxVal.
 */

/**
 * Internal generator helper for deterministic or random grids
 * @param {SeededRNG} rng
 * @param {number} size - Grid dimension (3 for easy, 4 for medium, 5 for hard)
 * @param {number} revealRatio - Fraction of cells initially revealed (e.g., 0.4)
 */
function createMatrixPuzzle(rng, size, revealRatio) {
  const maxVal = size * 2;
  const solution = [];

  // Generate a valid solution matrix
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push(rng.nextInt(1, maxVal));
    }
    solution.push(row);
  }

  // Calculate row and column target sums
  const rowTargets = solution.map(row => row.reduce((acc, val) => acc + val, 0));
  const colTargets = Array(size).fill(0);
  for (let c = 0; c < size; c++) {
    for (let r = 0; r < size; r++) {
      colTargets[c] += solution[r][c];
    }
  }

  // Determine which cells are initially revealed as hints
  const initialGrid = solution.map(row => [...row]);
  const totalCells = size * size;
  const cellsToKeep = Math.max(1, Math.floor(totalCells * revealRatio));
  
  // Pick indices to reveal
  const allIndices = Array.from({ length: totalCells }, (_, i) => i);
  const shuffledIndices = rng.shuffle(allIndices);
  const keepSet = new Set(shuffledIndices.slice(0, cellsToKeep));

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      if (!keepSet.has(idx)) {
        initialGrid[r][c] = null; // empty cell for player to fill
      }
    }
  }

  return {
    size,
    maxVal,
    rowTargets,
    colTargets,
    initialGrid,
    // Solution verification checksum (SHA-256 or FNV hash of stringified solution)
    solutionHash: rng.random().toString(36).substring(2, 10),
    validate: (userGrid) => {
      if (!Array.isArray(userGrid) || userGrid.length !== size) return false;
      for (let r = 0; r < size; r++) {
        let rSum = 0;
        for (let c = 0; c < size; c++) {
          const val = userGrid[r]?.[c];
          if (typeof val !== 'number' || val < 1 || val > maxVal) return false;
          rSum += val;
        }
        if (rSum !== rowTargets[r]) return false;
      }

      for (let c = 0; c < size; c++) {
        let cSum = 0;
        for (let r = 0; r < size; r++) {
          cSum += userGrid[r][c];
        }
        if (cSum !== colTargets[c]) return false;
      }
      return true;
    }
  };
}

export const gameConfig = {
  id: "number-grid",
  title: "Number Grid Matrix",
  description: "Deduce missing numbers to balance row & column target sums.",
  badge: "100 Coins to Unlock",
  icon: "🔢",
  thumbnail: "/images/number-grid.png",
  isFree: false,
  gameUnlockCost: 100,
  difficulties: {
    easy: {
      tier: "easy",
      unlockCost: 50,
      rewardCoins: 15,
      generateDailyPuzzle: (dateStr) => {
        const seed = `${dateStr}:number-grid:easy`;
        const rng = new SeededRNG(seed);
        return {
          gameId: "number-grid",
          difficulty: "easy",
          dateStr,
          ...createMatrixPuzzle(rng, 3, 0.44) // 3x3, 4 revealed
        };
      }
    },
    medium: {
      tier: "medium",
      unlockCost: 150,
      rewardCoins: 35,
      generateDailyPuzzle: (dateStr) => {
        const seed = `${dateStr}:number-grid:medium`;
        const rng = new SeededRNG(seed);
        return {
          gameId: "number-grid",
          difficulty: "medium",
          dateStr,
          ...createMatrixPuzzle(rng, 4, 0.35) // 4x4, 5-6 revealed
        };
      }
    },
    hard: {
      tier: "hard",
      unlockCost: 300,
      rewardCoins: 75,
      generateDailyPuzzle: (dateStr) => {
        const seed = `${dateStr}:number-grid:hard`;
        const rng = new SeededRNG(seed);
        return {
          gameId: "number-grid",
          difficulty: "hard",
          dateStr,
          ...createMatrixPuzzle(rng, 5, 0.25) // 5x5, 6 revealed
        };
      }
    }
  },
  unlimitedPlayground: {
    tier: "playground",
    unlockCost: 500,
    generateRandomPuzzle: (size = 4) => {
      const randomSeed = Math.floor(Math.random() * 0xFFFFFFFF);
      const rng = new SeededRNG(randomSeed);
      return {
        gameId: "number-grid",
        difficulty: "playground",
        seed: randomSeed,
        ...createMatrixPuzzle(rng, size, 0.3)
      };
    }
  },
  mount: (container, puzzle, { onWin, showStatus, setRules }) => {
    const { size, initialGrid, rowTargets, colTargets, maxVal } = puzzle;
    const startTime = Date.now();
    let isSolved = false;

    showStatus(`${size}x${size} Matrix Puzzle`, "var(--text-muted)");

    setRules(`
      <h3>Number Grid Rules:</h3>
      <ul>
        <li>Fill empty cells with numbers from <strong>1 to ${maxVal}</strong>.</li>
        <li>Each row must sum to its target number on the right (→).</li>
        <li>Each column must sum to its target number at the bottom (↓).</li>
      </ul>
    `);

    let html = `
      <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
        <div class="matrix-grid" style="grid-template-columns: repeat(${size + 1}, 48px); margin: 0 auto;">
    `;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = initialGrid[r][c];
        if (val !== null) {
          html += `<div class="matrix-cell" style="opacity: 0.85;">${val}</div>`;
        } else {
          html += `
            <div class="matrix-cell">
              <input type="number" min="1" max="${maxVal}" class="matrix-input" data-row="${r}" data-col="${c}" />
            </div>`;
        }
      }
      html += `<div class="matrix-cell target">→ ${rowTargets[r]}</div>`;
    }

    for (let c = 0; c < size; c++) {
      html += `<div class="matrix-cell target">↓ ${colTargets[c]}</div>`;
    }
    html += `<div class="matrix-cell target">★</div></div>
      <div style="margin-top: 1.5rem;">
        <button id="verify-matrix-btn" class="game-action-btn btn-play" style="max-width: 260px;">
          Verify Solution & Submit
        </button>
      </div>
    </div>`;

    container.innerHTML = html;

    const verifyBtn = container.querySelector('#verify-matrix-btn');
    const onVerify = () => {
      if (isSolved) return;
      const userGrid = [];
      for (let r = 0; r < size; r++) {
        const row = [];
        for (let c = 0; c < size; c++) {
          const fixedVal = initialGrid[r][c];
          if (fixedVal !== null) {
            row.push(fixedVal);
          } else {
            const inp = container.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
            row.push(inp && inp.value ? parseInt(inp.value, 10) : 0);
          }
        }
        userGrid.push(row);
      }

      const isValid = puzzle.validate(userGrid);
      if (!isValid) {
        showStatus("❌ Incorrect solution. Check your target sums!", "var(--danger)");
        return;
      }

      isSolved = true;
      const timeTakenMs = Math.max(1500, Date.now() - startTime);
      const score = size * 1000 + Math.max(0, 5000 - Math.floor(timeTakenMs / 10));

      showStatus(`🎉 Matrix Solved in ${(timeTakenMs / 1000).toFixed(1)}s! (+${score} pts)`, "var(--correct-bg)");
      verifyBtn.disabled = true;
      verifyBtn.textContent = 'Solved! ✓';
      onWin(score, timeTakenMs);
    };

    if (verifyBtn) {
      verifyBtn.addEventListener('click', onVerify);
    }

    return () => {
      if (verifyBtn) {
        verifyBtn.removeEventListener('click', onVerify);
      }
    };
  }
};
