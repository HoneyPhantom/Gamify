import { getAllGames, getDailyPuzzle, getPlaygroundPuzzle, getTodayDateStr } from '../games/index.js';
import { KB_ROWS, evaluateWordleGuess } from '../games/wordle.js';
import { api } from './api.js';

// Application State
let activeGameId = 'wordle';
let currentTier = 'easy';
let currentPuzzle = null;
let startTime = Date.now();
let userUnlocks = { easy_unlocked: 1, medium_unlocked: 0, hard_unlocked: 0, playground_unlocked: 0 };

// Wordle Runtime State
let targetWord = "";
let maxAttempts = 6;
let currentRow = 0;
let currentCol = 0;
let guesses = [];
let isGameOver = false;
let totalScore = 0;
let gamesWon = 0;

// DOM Elements
const lobbyView = document.getElementById('lobby-view');
const gameView = document.getElementById('game-view');
const gamesGrid = document.getElementById('games-grid');
const backToLobbyBtn = document.getElementById('back-to-lobby-btn');
const brandLogo = document.getElementById('brand-logo');

const lockedTierContainer = document.getElementById('locked-tier-container');
const lockedTierTitle = document.getElementById('locked-tier-title');
const unlockTierBtn = document.getElementById('unlock-tier-btn');
const activeGameContainer = document.getElementById('active-game-container');

const coinBalanceEl = document.getElementById('coin-balance');
const streakCountEl = document.getElementById('streak-count');
const statusEl = document.getElementById('status');
const totalScoreEl = document.getElementById('total-score');
const gamesWonEl = document.getElementById('games-won');
const boardEl = document.getElementById('board');
const keyboardEl = document.getElementById('keyboard');
const newGameBtn = document.getElementById('new-game-btn');
const tierTabs = document.getElementById('tier-tabs');

// =========================================================================
// 1. MODULAR GAMES LOBBY RENDERING
// =========================================================================
function renderGamesLobby() {
  const games = getAllGames();
  gamesGrid.innerHTML = '';

  games.forEach(game => {
    const box = document.createElement('div');
    box.className = 'game-box';
    box.innerHTML = `
      <div>
        <div class="game-box-top">
          <div class="game-icon">${game.icon || '🎮'}</div>
          <span class="game-pill">${game.badge || 'Daily Puzzle'}</span>
        </div>
        <h2 class="game-box-title">${game.title}</h2>
        <p class="game-box-desc">${game.description}</p>
      </div>
      <div class="game-box-footer">
        <span class="tiers-tag">4 Difficulty Tiers</span>
        <button class="enter-btn">Play Now →</button>
      </div>
    `;

    box.addEventListener('click', () => {
      enterGame(game.id);
    });

    gamesGrid.appendChild(box);
  });
}

function enterGame(gameId) {
  activeGameId = gameId;
  lobbyView.classList.add('hidden');
  gameView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Reset to easy tier on enter
  currentTier = 'easy';
  document.querySelectorAll('#tier-tabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tier === 'easy');
  });

  loadCurrentPuzzle();
  loadLeaderboard();
}

function returnToLobby() {
  gameView.classList.add('hidden');
  lobbyView.classList.remove('hidden');
}

backToLobbyBtn.addEventListener('click', returnToLobby);
brandLogo.addEventListener('click', returnToLobby);

// =========================================================================
// 2. PUZZLE GENERATION & TIER MANAGEMENT
// =========================================================================
function isTierUnlocked(tier) {
  if (tier === 'easy') return true;
  return userUnlocks[`${tier}_unlocked`] === 1;
}

function loadCurrentPuzzle() {
  const dateStr = getTodayDateStr();

  // Tier Access Check
  if (!isTierUnlocked(currentTier)) {
    activeGameContainer.classList.add('hidden');
    lockedTierContainer.classList.remove('hidden');
    lockedTierTitle.textContent = `${currentTier.toUpperCase()} Tier Locked`;
    unlockTierBtn.textContent = `Unlock ${currentTier.toUpperCase()}`;
    return;
  }

  lockedTierContainer.classList.add('hidden');
  activeGameContainer.classList.remove('hidden');

  // Generate puzzle locally using deterministic PRNG (zero-worker overhead)
  if (currentTier === 'playground') {
    currentPuzzle = getPlaygroundPuzzle(activeGameId);
  } else {
    currentPuzzle = getDailyPuzzle(activeGameId, currentTier, dateStr);
  }

  startTime = Date.now();

  if (activeGameId === 'wordle') {
    initWordle(currentPuzzle);
  }
}

// Tier Switch Listeners
tierTabs.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  document.querySelectorAll('#tier-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentTier = btn.dataset.tier;
  loadCurrentPuzzle();
});

// Unlock Tier Action
unlockTierBtn.addEventListener('click', async () => {
  try {
    unlockTierBtn.disabled = true;
    unlockTierBtn.textContent = 'Unlocking...';

    const res = await api.unlockTier(activeGameId, currentTier);
    userUnlocks = res.unlocks;
    coinBalanceEl.textContent = res.remainingCoins;
    loadCurrentPuzzle();
  } catch (err) {
    alert(err.message || 'Failed to unlock tier');
  } finally {
    unlockTierBtn.disabled = false;
  }
});

// =========================================================================
// 3. WORDLE GAME ENGINE
// =========================================================================
function initWordle(puzzle) {
  targetWord = puzzle.targetWord;
  maxAttempts = puzzle.maxAttempts || 6;
  currentRow = 0;
  currentCol = 0;
  guesses = Array(maxAttempts).fill("").map(() => Array(5).fill(""));
  isGameOver = false;

  statusEl.innerText = `Attempt 1 of ${maxAttempts}`;
  statusEl.style.color = "var(--text-muted)";

  renderBoard();
  renderKeyboard();
}

function updateScoreDisplay() {
  totalScoreEl.innerText = totalScore;
  gamesWonEl.innerText = gamesWon;
}

function renderBoard() {
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateRows = `repeat(${maxAttempts}, 1fr)`;

  for (let r = 0; r < maxAttempts; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";
    for (let c = 0; c < 5; c++) {
      const cellEl = document.createElement("div");
      cellEl.className = "cell";
      cellEl.id = `cell-${r}-${c}`;
      cellEl.innerText = guesses[r][c] || "";
      rowEl.appendChild(cellEl);
    }
    boardEl.appendChild(rowEl);
  }
}

function renderKeyboard() {
  keyboardEl.innerHTML = "";

  KB_ROWS.forEach(row => {
    const rowEl = document.createElement("div");
    rowEl.className = "kb-row";
    row.forEach(key => {
      const btn = document.createElement("button");
      btn.className = "key";
      btn.id = `key-${key}`;
      btn.innerText = key === "DELETE" ? "⌫" : key;
      if (key === "ENTER" || key === "DELETE") {
        btn.classList.add("wide");
      }
      btn.addEventListener("click", () => handleInput(key));
      rowEl.appendChild(btn);
    });
    keyboardEl.appendChild(rowEl);
  });
}

function handleInput(key) {
  if (isGameOver) return;

  if (key === "ENTER") {
    submitGuess();
  } else if (key === "DELETE" || key === "BACKSPACE") {
    removeLetter();
  } else if (/^[A-Z]$/.test(key)) {
    addLetter(key);
  }
}

function addLetter(letter) {
  if (currentCol < 5 && currentRow < maxAttempts) {
    guesses[currentRow][currentCol] = letter;
    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    if (cell) {
      cell.innerText = letter;
      cell.classList.add("pop");
      setTimeout(() => cell.classList.remove("pop"), 100);
    }
    currentCol++;
  }
}

function removeLetter() {
  if (currentCol > 0) {
    currentCol--;
    guesses[currentRow][currentCol] = "";
    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    if (cell) cell.innerText = "";
  }
}

async function submitGuess() {
  if (currentCol < 5) {
    showStatus("Word must be 5 letters!", "var(--danger)");
    return;
  }

  const guess = guesses[currentRow].join("");
  const result = evaluateWordleGuess(guess, targetWord);

  // Apply row animation and key coloring
  for (let i = 0; i < 5; i++) {
    const cell = document.getElementById(`cell-${currentRow}-${i}`);
    const letter = guess[i];
    const statusClass = result[i];

    if (cell) cell.classList.add(statusClass);

    const keyBtn = document.getElementById(`key-${letter}`);
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

  // Win Condition
  if (guess === targetWord) {
    const earnedPoints = (maxAttempts - currentRow) * 100;
    totalScore += earnedPoints;
    gamesWon++;
    updateScoreDisplay();

    showStatus(`🎉 Solved in ${currentRow + 1} tries! (+${earnedPoints} pts)`, "var(--correct-bg)");
    isGameOver = true;

    // Submit score to Cloudflare Workers API
    const timeTakenMs = Date.now() - startTime;
    try {
      const res = await api.submitScore({
        gameId: activeGameId,
        difficulty: currentTier,
        score: earnedPoints,
        timeTakenMs,
        dateStr: getTodayDateStr(),
      });

      if (res.coinsAwarded > 0) {
        coinBalanceEl.textContent = res.currentCoins;
        streakCountEl.textContent = res.streakCount;
        showStatus(`🎉 +${earnedPoints} Pts & +${res.coinsAwarded} Coins Earned!`, "var(--correct-bg)");
      }
      loadLeaderboard();
    } catch (e) {
      console.warn('Score submission note:', e.message);
    }
    return;
  }

  currentRow++;
  currentCol = 0;

  // Loss Condition
  if (currentRow >= maxAttempts) {
    showStatus(`Game Over! Word was: ${targetWord}`, "var(--danger)");
    isGameOver = true;
  } else {
    showStatus(`Attempt ${currentRow + 1} of ${maxAttempts}`, "var(--text-muted)");
  }
}

function showStatus(msg, color) {
  statusEl.innerText = msg;
  statusEl.style.color = color;
}

newGameBtn.addEventListener('click', () => {
  loadCurrentPuzzle();
});

// Physical Keyboard Listener
window.addEventListener("keydown", (e) => {
  if (gameView.classList.contains('hidden')) return;
  const key = e.key.toUpperCase();
  if (key === "ENTER" || key === "BACKSPACE" || /^[A-Z]$/.test(key)) {
    handleInput(key);
  }
});

// =========================================================================
// 4. LEADERBOARD RENDERING
// =========================================================================
async function loadLeaderboard() {
  const view = document.getElementById('leaderboard-view');
  try {
    const data = await api.getLeaderboard(activeGameId);
    renderLeaderboardView(data);
  } catch {
    view.innerHTML = '<p style="color: var(--text-muted);">Leaderboard is loading or offline.</p>';
  }
}

function renderLeaderboardView(data) {
  const view = document.getElementById('leaderboard-view');
  const isGlobal = document.getElementById('btn-global-tab').classList.contains('active');

  if (isGlobal) {
    const rows = data.globalLeaderboard || [];
    if (!rows.length) {
      view.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No global ranks yet (requires 20+ completed games).</p>';
      return;
    }
    view.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr><th>Rank</th><th>Player</th><th>Avg Score</th><th>Total Plays</th><th>Best</th></tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr>
              <td>#${i + 1}</td>
              <td>${r.display_name}</td>
              <td><strong>${r.global_average_score}</strong></td>
              <td>${r.plays_count}</td>
              <td>${r.best_score}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  } else {
    const rows = data.dailyLeaderboard || [];
    if (!rows.length) {
      view.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No daily entries recorded yet today. Be the first to solve!</p>';
      return;
    }
    view.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr><th>Rank</th><th>Player</th><th>Tier</th><th>Score</th><th>Time</th></tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr>
              <td>#${i + 1}</td>
              <td>${r.display_name}</td>
              <td>${r.difficulty}</td>
              <td><strong>${r.score}</strong></td>
              <td>${(r.time_taken_ms / 1000).toFixed(1)}s</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  }
}

document.getElementById('btn-daily-tab').addEventListener('click', (e) => {
  e.target.classList.add('active');
  document.getElementById('btn-global-tab').classList.remove('active');
  loadLeaderboard();
});

document.getElementById('btn-global-tab').addEventListener('click', (e) => {
  e.target.classList.add('active');
  document.getElementById('btn-daily-tab').classList.remove('active');
  loadLeaderboard();
});

// =========================================================================
// 5. APPLICATION BOOTSTRAP
// =========================================================================
renderGamesLobby();
updateScoreDisplay();
