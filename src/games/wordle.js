import { SeededRNG } from './prng.js';

export const WORD_LIST = [
  "APPLE", "BEACH", "BRAIN", "BREAD", "CHAIR", "CLOCK", "CLOUD", "DANCE",
  "DREAM", "DRIVE", "EARTH", "FLAME", "FRUIT", "GLASS", "GRAPE", "GREEN",
  "HEART", "HOUSE", "LIGHT", "MONEY", "MUSIC", "NIGHT", "OCEAN", "PARTY",
  "PLANT", "POWER", "RIVER", "SCENE", "SMILE", "SPACE", "STONE", "STORM",
  "TABLE", "TRAIN", "WATER", "WORLD", "YOUTH", "BRAVE", "SHARP", "SMART"
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
  title: "Wordle",
  description: "Guess the hidden 5-letter word in 6 attempts.",
  badge: "Free to Play",
  icon: "🔤",
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
    unlockCost: 500,
    generateRandomPuzzle: () => {
      const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
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
    let currentRow = 0;
    let currentCol = 0;
    const guesses = Array(maxAttempts).fill("").map(() => Array(5).fill(""));
    let isGameOver = false;

    showStatus(`Attempt 1 of ${maxAttempts}`, "var(--text-muted)");

    setRules(`
      <h3>Wordle Rules & Scoring:</h3>
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
          rowEl.appendChild(cellEl);
        }
        board.appendChild(rowEl);
      }
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

      if (guess === targetWord) {
        const earnedPoints = (maxAttempts - currentRow) * 100;
        showStatus(`🎉 Solved in ${currentRow + 1} tries! (+${earnedPoints} pts)`, "var(--correct-bg)");
        isGameOver = true;
        onWin(earnedPoints);
        return;
      }

      currentRow++;
      currentCol = 0;

      if (currentRow >= maxAttempts) {
        showStatus(`Game Over! Word was: ${targetWord}`, "var(--danger)");
        isGameOver = true;
      } else {
        showStatus(`Attempt ${currentRow + 1} of ${maxAttempts}`, "var(--text-muted)");
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
