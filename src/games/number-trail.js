import { SeededRNG } from './prng.js';

/**
 * Number Trail (Sequential Hamiltonian Path)
 * 
 * Rules:
 * 1. The grid contains numbered checkpoint nodes (1 to N) and blank cells.
 * 2. Player must draw a single continuous orthogonal path starting at 1,
 *    visiting every number in strict sequence (1 -> 2 -> 3 -> ... -> N).
 * 3. Every blank cell on the grid must be visited exactly once.
 * 4. No diagonal moves, and no revisiting cells.
 */

/**
 * Generates a full Hamiltonian path on an R x C grid using randomized DFS with Warnsdorff heuristic
 * @param {SeededRNG} rng
 * @param {number} rows
 * @param {number} cols
 * @returns {Array<[number, number]>}
 */
export function generateHamiltonianPath(rng, rows, cols) {
  const total = rows * cols;
  const visited = Array(rows).fill(0).map(() => Array(cols).fill(false));
  const path = [];

  // Start at a random cell
  const startR = rng.nextInt(0, rows - 1);
  const startC = rng.nextInt(0, cols - 1);

  function getNeighbors(r, c) {
    const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const neighbors = [];
    for (const [dr, dc] of deltas) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        neighbors.push([nr, nc]);
      }
    }
    return neighbors;
  }

  function dfs(r, c) {
    visited[r][c] = true;
    path.push([r, c]);

    if (path.length === total) {
      return true;
    }

    const neighbors = getNeighbors(r, c);
    // Sort by neighbor degree (Warnsdorff heuristic) with randomized tie breaks
    neighbors.sort((a, b) => {
      const degA = getNeighbors(a[0], a[1]).length;
      const degB = getNeighbors(b[0], b[1]).length;
      return (degA - degB) + rng.nextFloat(-0.4, 0.4);
    });

    for (const [nr, nc] of neighbors) {
      if (dfs(nr, nc)) return true;
    }

    visited[r][c] = false;
    path.pop();
    return false;
  }

  if (dfs(startR, startC)) {
    return path;
  }

  // Fallback snake pattern to guarantee a complete Hamiltonian path
  const snake = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const col = (r % 2 === 0) ? c : (cols - 1 - c);
      snake.push([r, col]);
    }
  }
  return snake;
}

/**
 * Creates a Number Trail puzzle with checkpoint numbers placed along the solution path
 */
function createNumberTrailPuzzle(rng, rows, cols, checkpointCount) {
  const totalCells = rows * cols;
  const solutionPath = generateHamiltonianPath(rng, rows, cols);

  // Grid holding numbers (1..N) or null for blanks
  const grid = Array(rows).fill(0).map(() => Array(cols).fill(null));

  // Determine checkpoint indices along the solution path (first is 0, last is totalCells-1)
  const checkpoints = [];
  const k = Math.min(checkpointCount, Math.floor(totalCells / 2));

  for (let i = 0; i < k; i++) {
    const stepIdx = Math.round((i * (totalCells - 1)) / (k - 1));
    checkpoints.push(stepIdx);
  }

  // Map checkpoints to sequential numbers 1..k
  const numberPositions = new Map(); // number -> [r, c]
  checkpoints.forEach((stepIdx, idx) => {
    const num = idx + 1;
    const [r, c] = solutionPath[stepIdx];
    grid[r][c] = num;
    numberPositions.set(num, [r, c]);
  });

  const maxNumber = k;

  return {
    rows,
    cols,
    totalCells,
    grid,
    maxNumber,
    startCell: solutionPath[0],
    endCell: solutionPath[totalCells - 1],
    solutionPath,
    validate: (userPath) => {
      if (!Array.isArray(userPath) || userPath.length !== totalCells) {
        return false;
      }

      const seen = new Set();
      let expectedNextNumber = 1;

      for (let i = 0; i < userPath.length; i++) {
        const [r, c] = userPath[i];
        if (typeof r !== 'number' || typeof c !== 'number' || r < 0 || r >= rows || c < 0 || c >= cols) {
          return false;
        }

        const key = `${r},${c}`;
        if (seen.has(key)) return false; // Revisit forbidden
        seen.add(key);

        // Orthogonal adjacency check (except first step)
        if (i > 0) {
          const [pr, pc] = userPath[i - 1];
          const dist = Math.abs(r - pr) + Math.abs(c - pc);
          if (dist !== 1) return false; // Must be orthogonal neighbor
        }

        // Checkpoint number sequence check
        const cellValue = grid[r][c];
        if (cellValue !== null) {
          if (cellValue !== expectedNextNumber) {
            return false; // Skipped or visited out of order
          }
          expectedNextNumber++;
        }
      }

      // Must have visited all cells and all checkpoints in order
      return seen.size === totalCells && expectedNextNumber === maxNumber + 1;
    }
  };
}

export const gameConfig = {
  id: "number-trail",
  title: "Number Trail",
  description: "Connect numbers in strict sequence with one continuous path visiting every cell.",
  badge: "Locked · 150 Coins",
  icon: "〰️",
  isFree: false,
  gameUnlockCost: 150,
  difficulties: {
    easy: {
      tier: "easy",
      unlockCost: 50,
      rewardCoins: 15,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:number-trail:easy`);
        return {
          gameId: "number-trail",
          difficulty: "easy",
          dateStr,
          ...createNumberTrailPuzzle(rng, 4, 4, 4) // 4x4 grid, 4 checkpoint numbers
        };
      }
    },
    medium: {
      tier: "medium",
      unlockCost: 150,
      rewardCoins: 35,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:number-trail:medium`);
        return {
          gameId: "number-trail",
          difficulty: "medium",
          dateStr,
          ...createNumberTrailPuzzle(rng, 5, 5, 6) // 5x5 grid, 6 checkpoint numbers
        };
      }
    },
    hard: {
      tier: "hard",
      unlockCost: 300,
      rewardCoins: 75,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:number-trail:hard`);
        return {
          gameId: "number-trail",
          difficulty: "hard",
          dateStr,
          ...createNumberTrailPuzzle(rng, 6, 6, 8) // 6x6 grid, 8 checkpoint numbers
        };
      }
    }
  },
  unlimitedPlayground: {
    tier: "playground",
    unlockCost: 500,
    generateRandomPuzzle: (rows = 5, cols = 5) => {
      const randomSeed = Math.floor(Math.random() * 0xFFFFFFFF);
      const rng = new SeededRNG(randomSeed);
      return {
        gameId: "number-trail",
        difficulty: "playground",
        seed: randomSeed,
        ...createNumberTrailPuzzle(rng, rows, cols, Math.floor(rows * cols / 4))
      };
    }
  }
};
