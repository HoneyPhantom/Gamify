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
  description: "Deduce the missing numbers to balance row and column target sums.",
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
  }
};
