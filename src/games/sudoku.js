import { SeededRNG } from './prng.js';

/**
 * Validates whether placing 'num' at (row, col) violates Sudoku rules.
 */
function isValidPlacement(grid, r, c, num, size, boxRows, boxCols) {
  for (let i = 0; i < size; i++) {
    if (grid[r][i] === num) return false;
    if (grid[i][c] === num) return false;
  }
  const boxStartR = Math.floor(r / boxRows) * boxRows;
  const boxStartC = Math.floor(c / boxCols) * boxCols;
  for (let br = 0; br < boxRows; br++) {
    for (let bc = 0; bc < boxCols; bc++) {
      if (grid[boxStartR + br][boxStartC + bc] === num) return false;
    }
  }
  return true;
}

/**
 * Solves or generates a Sudoku grid using randomized backtracking.
 */
function solveSudoku(grid, size, boxRows, boxCols, rng = null) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) {
        let nums = Array.from({ length: size }, (_, i) => i + 1);
        if (rng) nums = rng.shuffle(nums);
        for (const num of nums) {
          if (isValidPlacement(grid, r, c, num, size, boxRows, boxCols)) {
            grid[r][c] = num;
            if (solveSudoku(grid, size, boxRows, boxCols, rng)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Generates a valid puzzle by creating a full solution and removing cells.
 */
function generateSudokuPuzzle(rng, size, boxRows, boxCols, cluesCount) {
  const fullBoard = Array.from({ length: size }, () => Array(size).fill(0));
  solveSudoku(fullBoard, size, boxRows, boxCols, rng);

  const initialGrid = fullBoard.map(row => [...row]);
  const totalCells = size * size;
  const allIndices = Array.from({ length: totalCells }, (_, i) => i);
  const shuffledIndices = rng.shuffle(allIndices);
  const toRemoveCount = totalCells - cluesCount;
  const removeSet = new Set(shuffledIndices.slice(0, toRemoveCount));

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      if (removeSet.has(idx)) {
        initialGrid[r][c] = 0;
      }
    }
  }

  return {
    size,
    boxRows,
    boxCols,
    initialGrid,
    solution: fullBoard,
  };
}

export const gameConfig = {
  id: 'sudoku',
  title: 'Sudoku',
  description: 'Fill the grid with digits so every row, column, and subgrid contains each number without repeats.',
  badge: 'Logic Master',
  icon: '🔢',
  thumbnail: '/images/sudoku.png',
  isFree: false,
  gameUnlockCost: 150,

  difficulties: {
    easy: {
      unlockCost: 0,
      rewardCoins: 15,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`sudoku-easy-${dateStr}`);
        return generateSudokuPuzzle(rng, 4, 2, 2, 8); // 4x4 Mini-Sudoku (8 clues)
      },
    },
    medium: {
      unlockCost: 150,
      rewardCoins: 35,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`sudoku-med-${dateStr}`);
        return generateSudokuPuzzle(rng, 6, 2, 3, 18); // 6x6 Midi-Sudoku (18 clues)
      },
    },
    hard: {
      unlockCost: 300,
      rewardCoins: 75,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`sudoku-hard-${dateStr}`);
        return generateSudokuPuzzle(rng, 9, 3, 3, 34); // 9x9 Classic Sudoku (34 clues)
      },
    },
  },

  unlimitedPlayground: {
    unlockCost: 500,
    generatePlaygroundPuzzle: () => {
      const rng = new SeededRNG(`sudoku-play-${Date.now()}-${Math.random()}`);
      return generateSudokuPuzzle(rng, 6, 2, 3, 18);
    },
  },

  mount: (container, puzzle, callbacks) => {
    const { size, boxRows, boxCols, initialGrid, solution } = puzzle;
    const currentGrid = initialGrid.map(row => [...row]);
    const notesGrid = Array.from({ length: size }, () => Array.from({ length: size }, () => new Set()));
    let selectedCell = { r: -1, c: -1 };
    let isNotesMode = false;
    let isFinished = false;

    callbacks.setRules(`
      <h3>Sudoku Rules:</h3>
      <p>1. Every <strong>row</strong> and <strong>column</strong> must contain all digits from <strong>1 to ${size}</strong> without repeating.</p>
      <p>2. Every <strong>${boxRows}×${boxCols} box</strong> must contain each digit from 1 to ${size} without repetition.</p>
      <p>3. Tap a cell, then tap a number or use keyboard keys <strong>1-${size}</strong>.</p>
      <p>4. Toggle <strong>Notes (✏️)</strong> to jot down candidate possibilities in empty cells.</p>
      <p>5. Conflicting duplicate numbers will glow red in real-time.</p>
    `);

    // Render container HTML
    container.innerHTML = `
      <div class="sudoku-wrapper" style="display:flex; flex-direction:column; align-items:center; gap:0.85rem; width:100%; user-select:none;">
        <div class="sudoku-toolbar" style="display:flex; justify-content:space-between; width:100%; max-width:440px; font-size:0.85rem;">
          <div style="font-weight:700; color:var(--text-muted);">
            Size: <span style="color:var(--accent);">${size}×${size}</span>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button id="btn-sudoku-notes" class="btn-trail-action" style="padding:0.35rem 0.75rem; font-size:0.8rem;">
              ✏️ Notes: <span id="notes-status" style="font-weight:800; color:var(--text-muted);">OFF</span>
            </button>
            <button id="btn-sudoku-erase" class="btn-trail-action" style="padding:0.35rem 0.75rem; font-size:0.8rem;">
              ⌫ Erase
            </button>
          </div>
        </div>

        <div id="sudoku-board" class="sudoku-board size-${size}" style="
          display: grid;
          grid-template-columns: repeat(${size}, 1fr);
          gap: 0;
          background: #ffffff;
          border: 3px solid #0f172a;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.12);
        "></div>

        <div id="sudoku-keypad" class="sudoku-keypad" style="
          display: flex;
          gap: 0.45rem;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 440px;
          width: 100%;
          margin-top: 0.25rem;
        ">
          ${Array.from({ length: size }, (_, i) => i + 1).map(n => `
            <button class="sudoku-key-btn" data-num="${n}" style="
              flex: 1 0 38px;
              max-width: 46px;
              height: 46px;
              border-radius: 8px;
              border: 1.5px solid var(--border-color);
              background: #ffffff;
              font-size: 1.2rem;
              font-weight: 800;
              color: var(--accent);
              cursor: pointer;
              transition: all 0.15s;
              box-shadow: 0 2px 4px rgba(0,0,0,0.06);
            ">${n}</button>
          `).join('')}
        </div>
      </div>
    `;

    const boardEl = container.querySelector('#sudoku-board');
    const keypadEl = container.querySelector('#sudoku-keypad');
    const notesBtn = container.querySelector('#btn-sudoku-notes');
    const notesStatus = container.querySelector('#notes-status');
    const eraseBtn = container.querySelector('#btn-sudoku-erase');

    function getConflicts() {
      const conflictSet = new Set();
      // Rows & Cols
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const val = currentGrid[r][c];
          if (!val) continue;

          // Check row
          for (let c2 = c + 1; c2 < size; c2++) {
            if (currentGrid[r][c2] === val) {
              conflictSet.add(`${r}:${c}`);
              conflictSet.add(`${r}:${c2}`);
            }
          }
          // Check col
          for (let r2 = r + 1; r2 < size; r2++) {
            if (currentGrid[r2][c] === val) {
              conflictSet.add(`${r}:${c}`);
              conflictSet.add(`${r2}:${c}`);
            }
          }
        }
      }
      // Boxes
      for (let br = 0; br < size; br += boxRows) {
        for (let bc = 0; bc < size; bc += boxCols) {
          const seen = new Map();
          for (let r = 0; r < boxRows; r++) {
            for (let c = 0; c < boxCols; c++) {
              const row = br + r;
              const col = bc + c;
              const val = currentGrid[row][col];
              if (!val) continue;
              if (seen.has(val)) {
                conflictSet.add(`${row}:${col}`);
                conflictSet.add(seen.get(val));
              } else {
                seen.set(val, `${row}:${col}`);
              }
            }
          }
        }
      }
      return conflictSet;
    }

    function checkWinCondition() {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (currentGrid[r][c] === 0) return false;
          if (currentGrid[r][c] !== solution[r][c]) return false;
        }
      }
      return true;
    }

    function renderBoard() {
      if (!boardEl) return;
      boardEl.innerHTML = '';
      const conflicts = getConflicts();
      const selVal = selectedCell.r >= 0 && selectedCell.c >= 0 ? currentGrid[selectedCell.r][selectedCell.c] : null;

      const cellSize = size === 4 ? '68px' : size === 6 ? '54px' : '40px';
      const cellFontSize = size === 4 ? '1.8rem' : size === 6 ? '1.4rem' : '1.15rem';

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const val = currentGrid[r][c];
          const isInitial = initialGrid[r][c] !== 0;
          const isSelected = selectedCell.r === r && selectedCell.c === c;
          const isSameRowOrCol = selectedCell.r === r || selectedCell.c === c;
          const isSameBox = Math.floor(r / boxRows) === Math.floor(selectedCell.r / boxRows) &&
                            Math.floor(c / boxCols) === Math.floor(selectedCell.c / boxCols);
          const isHighlighted = (isSameRowOrCol || isSameBox) && !isSelected;
          const isSameValue = selVal && val === selVal && !isSelected;
          const hasConflict = conflicts.has(`${r}:${c}`);

          // Box border boundaries
          const borderRight = (c + 1) % boxCols === 0 && c !== size - 1 ? '2.5px solid #0f172a' : '1px solid #cbd5e1';
          const borderBottom = (r + 1) % boxRows === 0 && r !== size - 1 ? '2.5px solid #0f172a' : '1px solid #cbd5e1';

          let bg = '#ffffff';
          if (hasConflict) bg = '#fee2e2';
          else if (isSelected) bg = '#bae6fd';
          else if (isSameValue) bg = '#e0f2fe';
          else if (isHighlighted) bg = '#f8fafc';

          let textColor = isInitial ? '#0f172a' : 'var(--accent)';
          if (hasConflict) textColor = 'var(--danger)';

          const cellEl = document.createElement('div');
          cellEl.className = 'sudoku-cell';
          cellEl.dataset.r = r;
          cellEl.dataset.c = c;
          cellEl.style.width = cellSize;
          cellEl.style.height = cellSize;
          cellEl.style.borderRight = borderRight;
          cellEl.style.borderBottom = borderBottom;
          cellEl.style.background = bg;
          cellEl.style.color = textColor;
          cellEl.style.fontSize = cellFontSize;
          cellEl.style.fontWeight = isInitial ? '900' : '700';
          cellEl.style.display = 'flex';
          cellEl.style.alignItems = 'center';
          cellEl.style.justifyContent = 'center';
          cellEl.style.cursor = 'pointer';
          cellEl.style.position = 'relative';
          cellEl.style.boxSizing = 'border-box';
          cellEl.style.transition = 'background 0.15s';

          if (val > 0) {
            cellEl.textContent = val;
          } else {
            // Render pencil notes if any
            const cellNotes = notesGrid[r][c];
            if (cellNotes && cellNotes.size > 0) {
              const notesWrap = document.createElement('div');
              notesWrap.style.display = 'grid';
              notesWrap.style.gridTemplateColumns = `repeat(${boxCols}, 1fr)`;
              notesWrap.style.width = '100%';
              notesWrap.style.height = '100%';
              notesWrap.style.padding = '2px';
              notesWrap.style.fontSize = size === 9 ? '0.55rem' : '0.7rem';
              notesWrap.style.color = '#64748b';
              notesWrap.style.lineHeight = '1';

              for (let n = 1; n <= size; n++) {
                const noteSpan = document.createElement('span');
                noteSpan.style.textAlign = 'center';
                noteSpan.textContent = cellNotes.has(n) ? n : '';
                notesWrap.appendChild(noteSpan);
              }
              cellEl.appendChild(notesWrap);
            }
          }

          cellEl.addEventListener('click', () => {
            if (isFinished) return;
            selectedCell = { r, c };
            renderBoard();
          });

          boardEl.appendChild(cellEl);
        }
      }
    }

    function setNumberInSelected(num) {
      if (isFinished || selectedCell.r < 0 || selectedCell.c < 0) return;
      const { r, c } = selectedCell;
      if (initialGrid[r][c] !== 0) return; // Cannot overwrite initial given clues

      if (isNotesMode) {
        // Toggle note
        if (num === 0) {
          notesGrid[r][c].clear();
        } else {
          currentGrid[r][c] = 0; // Clear actual number when writing notes
          if (notesGrid[r][c].has(num)) {
            notesGrid[r][c].delete(num);
          } else {
            notesGrid[r][c].add(num);
          }
        }
      } else {
        // Place actual number
        notesGrid[r][c].clear();
        currentGrid[r][c] = num;
      }

      renderBoard();

      // Check win
      if (checkWinCondition()) {
        isFinished = true;
        const baseScore = size === 4 ? 400 : size === 6 ? 600 : 850;
        callbacks.showStatus('🎉 Spectacular! Sudoku puzzle solved!', 'var(--correct-bg)');
        setTimeout(() => {
          callbacks.onWin(baseScore);
        }, 600);
      }
    }

    // Keypad handlers
    keypadEl?.querySelectorAll('.sudoku-key-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const num = parseInt(btn.dataset.num, 10);
        setNumberInSelected(num);
      });
    });

    eraseBtn?.addEventListener('click', () => {
      setNumberInSelected(0);
    });

    notesBtn?.addEventListener('click', () => {
      isNotesMode = !isNotesMode;
      notesStatus.textContent = isNotesMode ? 'ON' : 'OFF';
      notesStatus.style.color = isNotesMode ? 'var(--accent)' : 'var(--text-muted)';
      notesBtn.style.borderColor = isNotesMode ? 'var(--accent)' : 'var(--border-color)';
    });

    // Keyboard controls
    const keyHandler = (e) => {
      if (isFinished) return;
      if (selectedCell.r < 0 || selectedCell.c < 0) return;

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= size) {
        e.preventDefault();
        setNumberInSelected(num);
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        e.preventDefault();
        setNumberInSelected(0);
      } else if (e.key === 'ArrowUp') {
        selectedCell.r = (selectedCell.r - 1 + size) % size;
        renderBoard();
      } else if (e.key === 'ArrowDown') {
        selectedCell.r = (selectedCell.r + 1) % size;
        renderBoard();
      } else if (e.key === 'ArrowLeft') {
        selectedCell.c = (selectedCell.c - 1 + size) % size;
        renderBoard();
      } else if (e.key === 'ArrowRight') {
        selectedCell.c = (selectedCell.c + 1) % size;
        renderBoard();
      }
    };

    window.addEventListener('keydown', keyHandler);

    renderBoard();

    // Return lifecycle cleanup function
    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  },
};
