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
  thumbnail: "/images/number-trail.png",
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
  },
  mount: (container, puzzle, { onWin, showStatus, setRules }) => {
    const { rows, cols, totalCells, grid, maxNumber, startCell, endCell } = puzzle;
    const startTime = Date.now();
    let userTrail = [startCell]; // Array of [r, c] starting at 1
    let isDragging = false;
    let isSolved = false;

    showStatus(`Step 1/${totalCells} · Connect numbers 1 to ${maxNumber} in order`, "var(--text-muted)");

    setRules(`
      <h3>Number Trail Rules & Controls:</h3>
      <ul>
        <li>Draw a single continuous orthogonal path starting at <strong>Node 1</strong> and ending at <strong>Node ${maxNumber}</strong>.</li>
        <li><strong>Every blank cell must be visited exactly once.</strong> No diagonal moves and no crossing over cells.</li>
        <li>Numbered checkpoint nodes must be visited in strict numerical sequence (1 → 2 → 3 ... → ${maxNumber}).</li>
        <li><strong>Controls:</strong> Drag with mouse/touch or click adjacent valid tiles to extend. Click the previous tile or Undo to backtrack.</li>
      </ul>
    `);

    container.innerHTML = `
      <div class="trail-container">
        <div class="trail-stats-bar">
          <span>Visited: <strong id="trail-progress-count">1</strong> / ${totalCells} cells</span>
          <span>Target: <strong id="trail-target-node" style="color:var(--accent)">Node 2</strong></span>
          <span>End: <strong>Node ${maxNumber}</strong></span>
        </div>

        <div id="dead-end-alert" class="dead-end-alert">
          ⚠️ Dead End! Path trapped with unvisited cells remaining. Click Undo or previous cell to backtrack.
        </div>

        <div id="trail-board" class="trail-board" style="grid-template-columns: repeat(${cols}, 56px);"></div>

        <div class="trail-controls-bar">
          <button id="trail-undo-btn" class="btn-trail-action">↶ Undo Step</button>
          <button id="trail-reset-btn" class="btn-trail-action">↺ Reset Grid</button>
        </div>
      </div>
    `;

    const boardEl = container.querySelector('#trail-board');
    const progressCountEl = container.querySelector('#trail-progress-count');
    const targetNodeEl = container.querySelector('#trail-target-node');
    const deadEndAlert = container.querySelector('#dead-end-alert');
    const undoBtn = container.querySelector('#trail-undo-btn');
    const resetBtn = container.querySelector('#trail-reset-btn');

    function getExpectedNextNodeNumber() {
      let count = 0;
      for (const [r, c] of userTrail) {
        if (grid[r][c] !== null) count++;
      }
      return count + 1;
    }

    const cellElements = [];
    for (let r = 0; r < rows; r++) {
      cellElements[r] = [];
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'trail-cell';
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        boardEl.appendChild(cell);
        cellElements[r][c] = cell;
      }
    }

    function renderCells() {
      const head = userTrail[userTrail.length - 1];
      const trailSet = new Map();
      userTrail.forEach(([r, c], idx) => trailSet.set(`${r},${c}`, idx));

      const nextTarget = getExpectedNextNodeNumber();
      if (nextTarget <= maxNumber) {
        targetNodeEl.textContent = `Node ${nextTarget}`;
        targetNodeEl.style.color = 'var(--accent)';
      } else {
        targetNodeEl.textContent = 'All Nodes Hit!';
        targetNodeEl.style.color = 'var(--correct-bg)';
      }

      progressCountEl.textContent = String(userTrail.length);

      // Check dead-end condition
      let isDeadEnd = false;
      if (userTrail.length < totalCells && !isSolved) {
        const [hr, hc] = head;
        const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        let hasValidMove = false;
        for (const [dr, dc] of deltas) {
          const nr = hr + dr;
          const nc = hc + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !trailSet.has(`${nr},${nc}`)) {
            const val = grid[nr][nc];
            if (val === null || val === nextTarget) {
              hasValidMove = true;
              break;
            }
          }
        }
        isDeadEnd = !hasValidMove;
      }
      deadEndAlert.style.display = isDeadEnd ? 'block' : 'none';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = cellElements[r][c];
          const val = grid[r][c];
          const isStart = r === startCell[0] && c === startCell[1];
          const isEnd = r === endCell[0] && c === endCell[1];
          const inTrail = trailSet.has(`${r},${c}`);
          const isHead = r === head[0] && c === head[1];

          cell.className = 'trail-cell';
          if (isStart) cell.classList.add('start-node');
          else if (isEnd) cell.classList.add('end-node');
          else if (val !== null) cell.classList.add('checkpoint');

          if (inTrail) cell.classList.add('active-trail');
          if (isHead) cell.classList.add('trail-head');

          const dist = Math.abs(r - head[0]) + Math.abs(c - head[1]);
          if (dist === 1 && !inTrail && (val === null || val === nextTarget)) {
            cell.classList.add('valid-next-hover');
          }

          if (val !== null) {
            cell.textContent = String(val);
          } else if (inTrail) {
            cell.textContent = '•';
          } else {
            cell.textContent = '';
          }
        }
      }
    }

    function handleCellInteraction(r, c) {
      if (isSolved) return;
      const head = userTrail[userTrail.length - 1];

      // If already at head, no-op
      if (head[0] === r && head[1] === c) return;

      // Clicking or dragging into immediate previous cell = backtrack
      if (userTrail.length > 1) {
        const prev = userTrail[userTrail.length - 2];
        if (prev[0] === r && prev[1] === c) {
          userTrail.pop();
          renderCells();
          return;
        }
      }

      // Must be orthogonal neighbor
      const dist = Math.abs(r - head[0]) + Math.abs(c - head[1]);
      if (dist !== 1) return;

      // Must not be already in trail
      const alreadyInTrail = userTrail.some(([tr, tc]) => tr === r && tc === c);
      if (alreadyInTrail) return;

      // Strict sequential checkpoint checking
      const val = grid[r][c];
      const nextTarget = getExpectedNextNodeNumber();
      if (val !== null && val !== nextTarget) {
        showStatus(`⚠️ Out of order! You must visit Node ${nextTarget} next.`, "var(--danger)");
        setTimeout(() => {
          if (!isSolved) {
            showStatus(`Step ${userTrail.length}/${totalCells} · Target Node ${nextTarget}`, "var(--text-muted)");
          }
        }, 1200);
        return;
      }

      // Add cell to path
      userTrail.push([r, c]);
      renderCells();

      // Check Win Condition
      if (userTrail.length === totalCells) {
        checkTrailCompletion();
      }
    }

    function checkTrailCompletion() {
      const isValid = puzzle.validate(userTrail);
      if (!isValid) return;

      isSolved = true;
      isDragging = false;
      const timeTakenMs = Math.max(1500, Date.now() - startTime);
      const score = totalCells * 120 + Math.max(0, 4000 - Math.floor(timeTakenMs / 10));

      showStatus(`🎉 Number Trail Solved! (${(timeTakenMs / 1000).toFixed(1)}s, +${score} pts)`, "var(--correct-bg)");

      container.querySelectorAll('.trail-cell').forEach(el => {
        el.style.backgroundColor = 'var(--correct-bg)';
        el.style.borderColor = '#fff';
        el.style.color = '#fff';
      });

      onWin(score, timeTakenMs);
    }

    const onUndo = () => {
      if (isSolved || userTrail.length <= 1) return;
      userTrail.pop();
      renderCells();
    };

    const onReset = () => {
      if (isSolved) return;
      userTrail = [startCell];
      renderCells();
    };

    undoBtn.addEventListener('click', onUndo);
    resetBtn.addEventListener('click', onReset);

    function getCoordsFromPoint(clientX, clientY) {
      const el = document.elementFromPoint(clientX, clientY);
      const target = el?.closest('.trail-cell');
      if (target && target.dataset.row !== undefined && target.dataset.col !== undefined) {
        return [parseInt(target.dataset.row, 10), parseInt(target.dataset.col, 10)];
      }
      return null;
    }

    // Pointer events for dragging
    const onPointerDown = (e) => {
      if (isSolved) return;
      const coords = getCoordsFromPoint(e.clientX, e.clientY);
      if (coords) {
        isDragging = true;
        handleCellInteraction(coords[0], coords[1]);
      }
    };

    const onPointerMove = (e) => {
      if (!isDragging || isSolved) return;
      const coords = getCoordsFromPoint(e.clientX, e.clientY);
      if (coords) {
        handleCellInteraction(coords[0], coords[1]);
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Touch events to prevent scrolling while drawing
    const onTouchStart = (e) => {
      if (isSolved) return;
      const touch = e.touches[0];
      const coords = getCoordsFromPoint(touch.clientX, touch.clientY);
      if (coords) {
        isDragging = true;
        handleCellInteraction(coords[0], coords[1]);
        if (e.cancelable) e.preventDefault();
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || isSolved) return;
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      const coords = getCoordsFromPoint(touch.clientX, touch.clientY);
      if (coords) {
        handleCellInteraction(coords[0], coords[1]);
      }
    };

    boardEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    boardEl.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);

    renderCells();

    return () => {
      undoBtn.removeEventListener('click', onUndo);
      resetBtn.removeEventListener('click', onReset);
      boardEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      boardEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onPointerUp);
    };
  }
};
