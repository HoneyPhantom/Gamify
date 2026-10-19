import { getAllGames, getDailyPuzzle, getPlaygroundPuzzle, getTodayDateStr } from '../games/index.js';
import { KB_ROWS, evaluateWordleGuess } from '../games/wordle.js';
import { api } from './api.js';

// =========================================================================
// APPLICATION STATE
// =========================================================================
let currentUser = api.getCachedUser();
let userUnlocks = {}; // Map of gameId -> unlock record

let activeGameId = 'wordle';
let currentTier = 'easy';
let currentPuzzle = null;
let startTime = Date.now();

// Wordle Runtime State
let targetWord = "";
let maxAttempts = 6;
let currentRow = 0;
let currentCol = 0;
let guesses = [];
let isWordleOver = false;
let totalScore = 0;
let gamesWon = 0;

// DOM Elements
const frontPageView = document.getElementById('front-page-view');
const gameView = document.getElementById('game-view');
const gamesScrollList = document.getElementById('games-scroll-list');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const brandLogo = document.getElementById('brand-logo');

const authStateLoggedIn = document.getElementById('auth-state-logged-in');
const authStateLoggedOut = document.getElementById('auth-state-logged-out');
const coinBalanceEl = document.getElementById('coin-balance');
const streakCountEl = document.getElementById('streak-count');
const navUserNameEl = document.getElementById('nav-user-name');
const btnOpenAuth = document.getElementById('btn-open-auth');
const btnLogout = document.getElementById('btn-logout');

const authModal = document.getElementById('auth-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const tabLoginBtn = document.getElementById('tab-login-btn');
const tabRegisterBtn = document.getElementById('tab-register-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authFeedback = document.getElementById('auth-feedback');
const loginUsernameInput = document.getElementById('login-username');
const loginPinInput = document.getElementById('login-pin');

const lockedTierContainer = document.getElementById('locked-tier-container');
const lockedBannerTitle = document.getElementById('locked-banner-title');
const lockedBannerDesc = document.getElementById('locked-banner-desc');
const unlockActionBtn = document.getElementById('unlock-action-btn');
const activeGameContainer = document.getElementById('active-game-container');
const gameBadge = document.getElementById('game-badge');
const tierTabs = document.getElementById('tier-tabs');
const statusEl = document.getElementById('status');
const totalScoreEl = document.getElementById('total-score');
const gamesWonEl = document.getElementById('games-won');
const gameArenaContent = document.getElementById('game-arena-content');
const gameRulesBox = document.getElementById('game-rules-box');
const newGameBtn = document.getElementById('new-game-btn');

// =========================================================================
// 1. AUTHENTICATION & SESSION MANAGEMENT (4-DIGIT PIN & 7-DAY EXPIRY)
// =========================================================================
function updateAuthUI() {
  if (currentUser && !api.isSessionExpired()) {
    authStateLoggedIn.classList.remove('hidden');
    authStateLoggedOut.classList.add('hidden');
    coinBalanceEl.textContent = currentUser.coins ?? 100;
    streakCountEl.textContent = currentUser.streakCount ?? 0;
    navUserNameEl.textContent = currentUser.displayName || currentUser.username;
  } else {
    authStateLoggedIn.classList.add('hidden');
    authStateLoggedOut.classList.remove('hidden');
  }
}

function openAuthModal(mode = 'login', prefilledUsername = '', notice = '') {
  authModal.classList.remove('hidden');
  authFeedback.style.display = 'none';

  if (notice) {
    showAuthFeedback(notice, 'error');
  }

  if (mode === 'register') {
    tabRegisterBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    document.getElementById('reg-username').focus();
  } else {
    tabLoginBtn.classList.add('active');
    tabRegisterBtn.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    if (prefilledUsername) {
      loginUsernameInput.value = prefilledUsername;
      loginPinInput.focus();
    } else {
      loginUsernameInput.focus();
    }
  }
}

function closeAuthModal() {
  authModal.classList.add('hidden');
  authFeedback.style.display = 'none';
}

function showAuthFeedback(msg, type = 'error') {
  authFeedback.textContent = msg;
  authFeedback.className = `feedback-banner ${type === 'error' ? 'feedback-error' : 'feedback-success'}`;
  authFeedback.style.display = 'block';
}

// Session Expiration Handler
api.onSessionExpired = (username) => {
  currentUser = null;
  updateAuthUI();
  renderGamesScrollList();
  openAuthModal('login', username || '', '🔒 Your 7-day session has expired. Enter your 4-digit PIN to continue.');
};

// Modal Tab Switchers
tabLoginBtn.addEventListener('click', () => openAuthModal('login'));
tabRegisterBtn.addEventListener('click', () => openAuthModal('register'));
btnOpenAuth.addEventListener('click', () => openAuthModal('login'));
modalCloseBtn.addEventListener('click', closeAuthModal);

// Close modal on click outside card
authModal.addEventListener('click', (e) => {
  if (e.target === authModal) closeAuthModal();
});

// Register Form Submit
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('reg-username').value.trim();
  const displayName = document.getElementById('reg-display-name').value.trim();
  const pin = document.getElementById('reg-pin').value.trim();
  const confirmPin = document.getElementById('reg-confirm-pin').value.trim();

  if (pin !== confirmPin) {
    showAuthFeedback('PINs do not match. Please enter the same 4-digit PIN.', 'error');
    return;
  }

  if (!/^\d{4}$/.test(pin)) {
    showAuthFeedback('PIN must be exactly 4 digits.', 'error');
    return;
  }

  try {
    const res = await api.register(username, displayName, pin);
    currentUser = res.user;
    updateAuthUI();
    closeAuthModal();
    await fetchUserProfile();
    renderGamesScrollList();
  } catch (err) {
    showAuthFeedback(err.message, 'error');
  }
});

// Login Form Submit
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = loginUsernameInput.value.trim();
  const pin = loginPinInput.value.trim();

  try {
    const res = await api.login(username, pin);
    currentUser = res.user;
    updateAuthUI();
    closeAuthModal();
    loginPinInput.value = '';
    await fetchUserProfile();
    renderGamesScrollList();
  } catch (err) {
    showAuthFeedback(err.message, 'error');
  }
});

// Logout / Lock Action
btnLogout.addEventListener('click', () => {
  api.logout();
  currentUser = null;
  userUnlocks = {};
  updateAuthUI();
  renderGamesScrollList();
  returnToHome();
});

// Fetch Profile & Unlocks from Server
async function fetchUserProfile() {
  if (!api.token || api.isSessionExpired()) return;
  try {
    const res = await api.getMe();
    currentUser = {
      ...res.user,
      coins: res.user.coins,
      streakCount: res.user.streak_count,
      displayName: res.user.display_name,
      username: res.user.username,
    };
    userUnlocks = {};
    (res.unlocks || []).forEach(u => {
      userUnlocks[u.game_id] = u;
    });
    updateAuthUI();
  } catch (e) {
    console.warn('Profile fetch note:', e.message);
  }
}

// =========================================================================
// 2. FRONT PAGE & SCROLLABLE GAMES LIST
// =========================================================================
function isGameUnlocked(gameId) {
  if (gameId === 'wordle') return true; // Wordle is free by default
  const record = userUnlocks[gameId];
  return record && record.game_unlocked === 1;
}

function isTierUnlocked(gameId, tier) {
  if (!isGameUnlocked(gameId)) return false;
  if (tier === 'easy') return true;
  const record = userUnlocks[gameId];
  return record && record[`${tier}_unlocked`] === 1;
}

function renderGamesScrollList() {
  const games = getAllGames();
  gamesScrollList.innerHTML = '';

  games.forEach(game => {
    const unlocked = isGameUnlocked(game.id);
    const card = document.createElement('div');
    card.className = 'game-card-box';

    let statusHtml = '';
    let actionBtnHtml = '';

    if (game.isFree || unlocked) {
      statusHtml = `<span class="game-status-badge ${game.isFree ? 'status-free' : 'status-unlocked'}">${game.isFree ? 'Free to Play' : 'Unlocked'}</span>`;
      actionBtnHtml = `<button class="game-action-btn btn-play">Play ${game.title} →</button>`;
    } else {
      statusHtml = `<span class="game-status-badge status-locked">🔒 ${game.gameUnlockCost || 100} Coins</span>`;
      actionBtnHtml = `<button class="game-action-btn btn-unlock-gold">Unlock for ${game.gameUnlockCost || 100} Coins 🪙</button>`;
    }

    card.innerHTML = `
      <div>
        <div class="game-card-top">
          <div class="game-card-icon">${game.icon || '🎮'}</div>
          ${statusHtml}
        </div>
        <h3 class="game-card-title">${game.title}</h3>
        <p class="game-card-desc">${game.description}</p>
        <div class="game-card-tiers">
          <span>🎯 Easy · Medium · Hard · Playground</span>
        </div>
      </div>
      <div>
        ${actionBtnHtml}
      </div>
    `;

    card.addEventListener('click', () => {
      handleGameCardClick(game);
    });

    gamesScrollList.appendChild(card);
  });
}

async function handleGameCardClick(game) {
  // If not logged in, prompt user to log in or create profile
  if (!currentUser || api.isSessionExpired()) {
    openAuthModal('login', '', 'Please create a profile or unlock with your 4-digit PIN to play and save your coins & streaks.');
    return;
  }

  // If game is locked (e.g. number-grid)
  if (!isGameUnlocked(game.id)) {
    const cost = game.gameUnlockCost || 100;
    const confirmUnlock = confirm(
      `Unlock ${game.title} for ${cost} coins?\n\nYour Balance: ${currentUser.coins ?? 0} coins`
    );

    if (confirmUnlock) {
      await unlockGameBase(game.id, cost);
    }
    return;
  }

  // Game is unlocked, enter game view
  enterGame(game.id);
}

async function unlockGameBase(gameId, cost) {
  try {
    const res = await api.unlockTier(gameId, 'game');
    userUnlocks[gameId] = res.unlocks;
    currentUser.coins = res.remainingCoins;
    updateAuthUI();
    renderGamesScrollList();
    alert(`🎉 ${res.message}`);
    enterGame(gameId);
  } catch (err) {
    alert(err.message || 'Failed to unlock game');
  }
}

function enterGame(gameId) {
  activeGameId = gameId;
  frontPageView.classList.add('hidden');
  gameView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Reset to easy tier
  currentTier = 'easy';
  document.querySelectorAll('#tier-tabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tier === 'easy');
  });

  loadCurrentPuzzle();
  loadLeaderboard();
}

function returnToHome() {
  gameView.classList.add('hidden');
  frontPageView.classList.remove('hidden');
  renderGamesScrollList();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

backToHomeBtn.addEventListener('click', returnToHome);
brandLogo.addEventListener('click', returnToHome);

// =========================================================================
// 3. TIER MANAGEMENT & UNLOCKS
// =========================================================================
tierTabs.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  document.querySelectorAll('#tier-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentTier = btn.dataset.tier;
  loadCurrentPuzzle();
});

function loadCurrentPuzzle() {
  const dateStr = getTodayDateStr();

  // 1. Check if game itself is unlocked
  if (!isGameUnlocked(activeGameId)) {
    activeGameContainer.classList.add('hidden');
    lockedTierContainer.classList.remove('hidden');
    const game = getAllGames().find(g => g.id === activeGameId);
    const gameCost = game?.gameUnlockCost || 100;
    lockedBannerTitle.textContent = `${game?.title || activeGameId} Locked`;
    lockedBannerDesc.textContent = `Unlock ${game?.title || activeGameId} with ${gameCost} coins to access its daily challenges.`;
    unlockActionBtn.textContent = `Unlock Game (${gameCost} Coins) 🪙`;
    unlockActionBtn.onclick = () => unlockGameBase(activeGameId, gameCost);
    return;
  }

  // 2. Check if selected tier is unlocked
  if (!isTierUnlocked(activeGameId, currentTier)) {
    activeGameContainer.classList.add('hidden');
    lockedTierContainer.classList.remove('hidden');
    const tierCosts = { easy: 50, medium: 150, hard: 300, playground: 500 };
    const cost = tierCosts[currentTier] || 150;

    lockedBannerTitle.textContent = `${currentTier.toUpperCase()} Tier Locked`;
    lockedBannerDesc.textContent = currentTier === 'playground'
      ? 'Unlimited Playground requires conquering and unlocking Easy, Medium, and Hard tiers first.'
      : `Unlock ${currentTier.toUpperCase()} tier for ${cost} coins to play and earn bigger rewards.`;

    unlockActionBtn.textContent = `Unlock ${currentTier.toUpperCase()} (${cost} Coins) 🪙`;
    unlockActionBtn.onclick = () => unlockSpecificTier(activeGameId, currentTier);
    return;
  }

  // Unlocked & accessible
  lockedTierContainer.classList.add('hidden');
  activeGameContainer.classList.remove('hidden');

  if (currentTier === 'playground') {
    currentPuzzle = getPlaygroundPuzzle(activeGameId);
    gameBadge.textContent = 'Playground Mode (Unranked)';
  } else {
    currentPuzzle = getDailyPuzzle(activeGameId, currentTier, dateStr);
    gameBadge.textContent = `Daily ${currentTier.toUpperCase()} (${dateStr})`;
  }

  startTime = Date.now();

  if (activeGameId === 'wordle') {
    mountWordle(currentPuzzle);
  } else if (activeGameId === 'number-grid') {
    mountNumberGrid(currentPuzzle);
  } else if (activeGameId === 'number-trail') {
    mountNumberTrail(currentPuzzle);
  }
}

async function unlockSpecificTier(gameId, tier) {
  try {
    unlockActionBtn.disabled = true;
    unlockActionBtn.textContent = 'Unlocking...';

    const res = await api.unlockTier(gameId, tier);
    userUnlocks[gameId] = res.unlocks;
    currentUser.coins = res.remainingCoins;
    updateAuthUI();
    alert(`🎉 ${res.message}`);
    loadCurrentPuzzle();
  } catch (err) {
    alert(err.message || 'Failed to unlock tier');
  } finally {
    unlockActionBtn.disabled = false;
  }
}

// =========================================================================
// 4. WORDLE GAME ENGINE
// =========================================================================
function mountWordle(puzzle) {
  targetWord = puzzle.targetWord;
  maxAttempts = puzzle.maxAttempts || 6;
  currentRow = 0;
  currentCol = 0;
  guesses = Array(maxAttempts).fill("").map(() => Array(5).fill(""));
  isWordleOver = false;

  statusEl.innerText = `Attempt 1 of ${maxAttempts}`;
  statusEl.style.color = "var(--text-muted)";
  updateScoreDisplay();

  gameRulesBox.innerHTML = `
    <h3>How to Play & Scoring:</h3>
    <ul>
      <li>Guess the 5-letter word in <strong>${maxAttempts} attempts</strong>.</li>
      <li><strong>Scoring:</strong> Earlier solves earn higher points: 1st = 600, 2nd = 500, 3rd = 400, etc.</li>
      <li><span style="color:var(--correct-bg); font-weight:bold;">Green:</span> Correct letter and spot.</li>
      <li><span style="color:var(--present-bg); font-weight:bold;">Yellow:</span> Letter is in the word but wrong spot.</li>
      <li><span style="color:var(--text-muted); font-weight:bold;">Dark:</span> Letter is not in the word.</li>
    </ul>
  `;

  renderWordleBoard();
  renderWordleKeyboard();
}

function updateScoreDisplay() {
  totalScoreEl.innerText = totalScore;
  gamesWonEl.innerText = gamesWon;
}

function renderWordleBoard() {
  gameArenaContent.innerHTML = `
    <div id="board" class="board" style="grid-template-rows: repeat(${maxAttempts}, 1fr);"></div>
    <div id="keyboard" class="keyboard"></div>
  `;

  const board = document.getElementById('board');
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
    board.appendChild(rowEl);
  }
}

function renderWordleKeyboard() {
  const kb = document.getElementById('keyboard');
  kb.innerHTML = "";

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
      btn.addEventListener("click", () => handleWordleInput(key));
      rowEl.appendChild(btn);
    });
    kb.appendChild(rowEl);
  });
}

function handleWordleInput(key) {
  if (isWordleOver) return;

  if (key === "ENTER") {
    submitWordleGuess();
  } else if (key === "DELETE" || key === "BACKSPACE") {
    removeWordleLetter();
  } else if (/^[A-Z]$/.test(key)) {
    addWordleLetter(key);
  }
}

function addWordleLetter(letter) {
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

function removeWordleLetter() {
  if (currentCol > 0) {
    currentCol--;
    guesses[currentRow][currentCol] = "";
    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    if (cell) cell.innerText = "";
  }
}

async function submitWordleGuess() {
  if (currentCol < 5) {
    showWordleStatus("Word must be 5 letters!", "var(--danger)");
    return;
  }

  const guess = guesses[currentRow].join("");
  const result = evaluateWordleGuess(guess, targetWord);

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

    showWordleStatus(`🎉 Solved in ${currentRow + 1} tries! (+${earnedPoints} pts)`, "var(--correct-bg)");
    isWordleOver = true;

    // Submit score to Cloudflare API
    const timeTakenMs = Math.max(1500, Date.now() - startTime);
    try {
      const res = await api.submitScore({
        gameId: 'wordle',
        difficulty: currentTier,
        score: earnedPoints,
        timeTakenMs,
        dateStr: getTodayDateStr(),
      });

      if (res.coinsAwarded > 0) {
        currentUser.coins = res.currentCoins;
        currentUser.streakCount = res.streakCount;
        updateAuthUI();
        showWordleStatus(`🎉 +${earnedPoints} Pts & +${res.coinsAwarded} Coins Earned!`, "var(--correct-bg)");
      }
      loadLeaderboard();
    } catch (e) {
      console.warn('Score submission sync note:', e.message);
    }
    return;
  }

  currentRow++;
  currentCol = 0;

  if (currentRow >= maxAttempts) {
    showWordleStatus(`Game Over! Word was: ${targetWord}`, "var(--danger)");
    isWordleOver = true;
  } else {
    showWordleStatus(`Attempt ${currentRow + 1} of ${maxAttempts}`, "var(--text-muted)");
  }
}

function showWordleStatus(msg, color) {
  statusEl.innerText = msg;
  statusEl.style.color = color;
}

// Physical Keyboard Listener
window.addEventListener("keydown", (e) => {
  if (gameView.classList.contains('hidden') || activeGameId !== 'wordle') return;
  const key = e.key.toUpperCase();
  if (key === "ENTER" || key === "BACKSPACE" || /^[A-Z]$/.test(key)) {
    handleWordleInput(key);
  }
});

// =========================================================================
// 5. NUMBER GRID MATRIX GAME ENGINE
// =========================================================================
function mountNumberGrid(puzzle) {
  const { size, initialGrid, rowTargets, colTargets, maxVal } = puzzle;

  statusEl.innerText = `${size}x${size} Matrix Puzzle`;
  statusEl.style.color = "var(--text-muted)";

  gameRulesBox.innerHTML = `
    <h3>Number Grid Rules:</h3>
    <ul>
      <li>Fill empty cells with numbers from <strong>1 to ${maxVal}</strong>.</li>
      <li>Each row must sum to its target number on the right (→).</li>
      <li>Each column must sum to its target number at the bottom (↓).</li>
    </ul>
  `;

  let html = `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div class="matrix-grid" style="grid-template-columns: repeat(${size + 1}, 48px);">
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
    <div style="margin-top: 1rem;">
      <button id="verify-matrix-btn" class="game-action-btn btn-play" style="max-width: 260px;">
        Verify Solution & Submit
      </button>
    </div>
  </div>`;

  gameArenaContent.innerHTML = html;

  document.getElementById('verify-matrix-btn').addEventListener('click', async () => {
    const userGrid = [];
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        const fixedVal = initialGrid[r][c];
        if (fixedVal !== null) {
          row.push(fixedVal);
        } else {
          const inp = gameArenaContent.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
          row.push(inp && inp.value ? parseInt(inp.value, 10) : 0);
        }
      }
      userGrid.push(row);
    }

    const isValid = puzzle.validate(userGrid);
    if (!isValid) {
      statusEl.innerText = "❌ Incorrect solution. Check your target sums!";
      statusEl.style.color = "var(--danger)";
      return;
    }

    const timeTakenMs = Math.max(1500, Date.now() - startTime);
    const score = size * 1000 + Math.max(0, 5000 - Math.floor(timeTakenMs / 10));

    statusEl.innerText = `🎉 Matrix Solved in ${(timeTakenMs / 1000).toFixed(1)}s! (+${score} pts)`;
    statusEl.style.color = "var(--correct-bg)";

    try {
      const res = await api.submitScore({
        gameId: 'number-grid',
        difficulty: currentTier,
        score,
        timeTakenMs,
        dateStr: getTodayDateStr(),
      });

      if (res.coinsAwarded > 0) {
        currentUser.coins = res.currentCoins;
        currentUser.streakCount = res.streakCount;
        updateAuthUI();
        statusEl.innerText = `🎉 Solved! +${score} Pts & +${res.coinsAwarded} Coins Earned!`;
      }
      loadLeaderboard();
    } catch (e) {
      console.warn('Matrix score submission note:', e.message);
    }
  });
}

// =========================================================================
// 6. NUMBER TRAIL (SEQUENTIAL PATH) GAME ENGINE
// =========================================================================
function mountNumberTrail(puzzle) {
  const { rows, cols, totalCells, grid, maxNumber, startCell, endCell } = puzzle;
  let userTrail = [startCell]; // Array of [r, c] starting at 1
  let isDragging = false;
  let isSolved = false;

  statusEl.innerText = `Step 1/${totalCells} · Connect numbers 1 to ${maxNumber} in order`;
  statusEl.style.color = "var(--text-muted)";
  updateScoreDisplay();

  gameRulesBox.innerHTML = `
    <h3>Number Trail Rules & Controls:</h3>
    <ul>
      <li>Draw a single continuous orthogonal path starting at <strong>Node 1</strong> and ending at <strong>Node ${maxNumber}</strong>.</li>
      <li><strong>Every blank cell must be visited exactly once.</strong> No diagonal moves and no crossing over cells.</li>
      <li>Numbered checkpoint nodes must be visited in strict numerical sequence (1 → 2 → 3 ... → ${maxNumber}).</li>
      <li><strong>Controls:</strong> Drag with mouse/touch or click adjacent valid tiles to extend. Click the previous tile or Undo to backtrack.</li>
    </ul>
  `;

  gameArenaContent.innerHTML = `
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

  const boardEl = document.getElementById('trail-board');
  const progressCountEl = document.getElementById('trail-progress-count');
  const targetNodeEl = document.getElementById('trail-target-node');
  const deadEndAlert = document.getElementById('dead-end-alert');
  const undoBtn = document.getElementById('trail-undo-btn');
  const resetBtn = document.getElementById('trail-reset-btn');

  function getExpectedNextNodeNumber() {
    let count = 0;
    for (const [r, c] of userTrail) {
      if (grid[r][c] !== null) count++;
    }
    return count + 1;
  }

  function renderCells() {
    boardEl.innerHTML = '';
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

    progressCountEl.textContent = userTrail.length;

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
        const cell = document.createElement('div');
        cell.className = 'trail-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        const val = grid[r][c];
        const isStart = r === startCell[0] && c === startCell[1];
        const isEnd = r === endCell[0] && c === endCell[1];
        const inTrail = trailSet.has(`${r},${c}`);
        const isHead = r === head[0] && c === head[1];

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
          cell.textContent = val;
        } else if (inTrail) {
          cell.textContent = '•';
        }

        // Mouse & Touch Interaction
        cell.addEventListener('pointerdown', (e) => {
          if (isSolved) return;
          try { cell.setPointerCapture(e.pointerId); } catch {}
          isDragging = true;
          handleCellInteraction(r, c);
        });

        cell.addEventListener('pointerenter', () => {
          if (isDragging && !isSolved) {
            handleCellInteraction(r, c);
          }
        });

        cell.addEventListener('pointerup', (e) => {
          try { cell.releasePointerCapture(e.pointerId); } catch {}
          isDragging = false;
        });

        boardEl.appendChild(cell);
      }
    }
  }

  function handleCellInteraction(r, c) {
    if (isSolved) return;
    const head = userTrail[userTrail.length - 1];

    // Clicking immediate previous cell = backtrack
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
      statusEl.innerText = `⚠️ Out of order! You must visit Node ${nextTarget} next.`;
      statusEl.style.color = "var(--danger)";
      setTimeout(() => {
        if (!isSolved) {
          statusEl.innerText = `Step ${userTrail.length}/${totalCells} · Target Node ${nextTarget}`;
          statusEl.style.color = "var(--text-muted)";
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

  async function checkTrailCompletion() {
    const isValid = puzzle.validate(userTrail);
    if (!isValid) return;

    isSolved = true;
    isDragging = false;
    const timeTakenMs = Math.max(1500, Date.now() - startTime);
    const score = totalCells * 120 + Math.max(0, 4000 - Math.floor(timeTakenMs / 10));

    statusEl.innerText = `🎉 Number Trail Solved! (${(timeTakenMs / 1000).toFixed(1)}s, +${score} pts)`;
    statusEl.style.color = "var(--correct-bg)";

    document.querySelectorAll('.trail-cell').forEach(el => {
      el.style.backgroundColor = 'var(--correct-bg)';
      el.style.borderColor = '#fff';
      el.style.color = '#fff';
    });

    try {
      const res = await api.submitScore({
        gameId: 'number-trail',
        difficulty: currentTier,
        score,
        timeTakenMs,
        dateStr: getTodayDateStr(),
      });

      if (res.coinsAwarded > 0) {
        currentUser.coins = res.currentCoins;
        currentUser.streakCount = res.streakCount;
        updateAuthUI();
        statusEl.innerText = `🏆 Solved! +${score} Pts & +${res.coinsAwarded} Coins Earned!`;
      }
      loadLeaderboard();
    } catch (e) {
      console.warn('Trail score submission note:', e.message);
    }
  }

  undoBtn.addEventListener('click', () => {
    if (isSolved || userTrail.length <= 1) return;
    userTrail.pop();
    renderCells();
  });

  resetBtn.addEventListener('click', () => {
    if (isSolved) return;
    userTrail = [startCell];
    renderCells();
  });

  // Touch Dragging Handler for Mobile Devices
  boardEl.addEventListener('touchmove', (e) => {
    if (!isDragging || isSolved) return;
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.trail-cell');
    if (target && target.dataset.row !== undefined && target.dataset.col !== undefined) {
      const r = parseInt(target.dataset.row, 10);
      const c = parseInt(target.dataset.col, 10);
      handleCellInteraction(r, c);
    }
  }, { passive: false });

  window.addEventListener('pointerup', () => {
    isDragging = false;
  });

  renderCells();
}

newGameBtn.addEventListener('click', () => {
  loadCurrentPuzzle();
});

// =========================================================================
// 6. LEADERBOARDS
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
// 7. INITIAL BOOTSTRAP
// =========================================================================
async function bootstrap() {
  updateAuthUI();
  await fetchUserProfile();
  renderGamesScrollList();
}

bootstrap();
