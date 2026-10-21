import { getAllGames, getGameConfig, getDailyPuzzle, getPlaygroundPuzzle, getTodayDateStr } from '../games/index.js';
import { api } from './api.js';

// =========================================================================
// APPLICATION STATE
// =========================================================================
let currentUser = api.getCachedUser();
let userUnlocks = {}; // Map of gameId -> unlock record
let userStats = {}; // Map of gameId -> user_game_stats record { total_score, plays_count, best_score, average_score }
let todayCompletions = new Set(); // Set of "gameId:difficulty" completed today

let activeGameId = 'wordle';
let currentTier = 'easy';
let currentPuzzle = null;
let startTime = Date.now();
let activeGameCleanup = null; // Holds the cleanup function of the currently mounted game

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
// 1. AUTHENTICATION & INTERACTIVE 4-DIGIT PIN SYSTEM
// =========================================================================

function setupPinInputs() {
  const groups = [
    { containerId: 'login-pin-boxes', targetId: 'login-pin' },
    { containerId: 'reg-pin-boxes', targetId: 'reg-pin' },
    { containerId: 'reg-confirm-boxes', targetId: 'reg-confirm-pin' }
  ];

  groups.forEach(({ containerId, targetId }) => {
    const container = document.getElementById(containerId);
    const hiddenInput = document.getElementById(targetId);
    if (!container || !hiddenInput) return;

    const slots = Array.from(container.querySelectorAll('.pin-digit-slot'));

    function syncValue() {
      const pin = slots.map(s => s.value).join('');
      hiddenInput.value = pin;
      slots.forEach(s => s.classList.toggle('filled', s.value.length > 0));

      if (targetId === 'reg-pin' || targetId === 'reg-confirm-pin') {
        updatePinMatchIndicator();
      }
    }

    slots.forEach((slot, idx) => {
      // Numerical filtering and auto-advance
      slot.addEventListener('input', (e) => {
        const val = slot.value.replace(/\D/g, '');
        slot.value = val ? val[val.length - 1] : '';
        syncValue();
        if (slot.value && idx < slots.length - 1) {
          slots[idx + 1].focus();
        }
      });

      // Backspace and navigation
      slot.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          if (!slot.value && idx > 0) {
            slots[idx - 1].value = '';
            slots[idx - 1].focus();
            syncValue();
          }
        } else if (e.key === 'ArrowLeft' && idx > 0) {
          slots[idx - 1].focus();
        } else if (e.key === 'ArrowRight' && idx < slots.length - 1) {
          slots[idx + 1].focus();
        }
      });

      // Quick Paste Support (e.g. paste "5821")
      slot.addEventListener('paste', (e) => {
        e.preventDefault();
        const clipboard = e.clipboardData || window.clipboardData;
        const pasted = (clipboard ? clipboard.getData('text') : '').replace(/\D/g, '');
        if (!pasted) return;

        for (let i = 0; i < slots.length; i++) {
          slots[i].value = pasted[i] || '';
        }
        syncValue();
        const focusIdx = Math.min(pasted.length, slots.length - 1);
        slots[focusIdx].focus();
      });
    });

    // Eye toggle button for this PIN group
    const eyeBtn = container.parentElement?.querySelector('.btn-toggle-eye');
    if (eyeBtn) {
      eyeBtn.addEventListener('click', () => {
        const isPassword = slots[0].type === 'password';
        slots.forEach(s => s.type = isPassword ? 'text' : 'password');
        eyeBtn.textContent = isPassword ? '🙈' : '👁️';
      });
    }
  });
}

function updatePinMatchIndicator() {
  const regPin = document.getElementById('reg-pin')?.value || '';
  const confirmPin = document.getElementById('reg-confirm-pin')?.value || '';
  const statusEl = document.getElementById('reg-pin-match-status');
  if (!statusEl) return;

  if (!confirmPin) {
    statusEl.textContent = '';
    statusEl.className = 'pin-match-indicator';
    return;
  }

  if (regPin === confirmPin && regPin.length === 4) {
    statusEl.textContent = '✓ PINs Match';
    statusEl.className = 'pin-match-indicator match';
  } else {
    statusEl.textContent = '⚠️ PINs do not match';
    statusEl.className = 'pin-match-indicator mismatch';
  }
}

function clearPinBoxes(containerId, targetId) {
  const container = document.getElementById(containerId);
  const target = document.getElementById(targetId);
  if (container) {
    container.querySelectorAll('.pin-digit-slot').forEach(s => {
      s.value = '';
      s.classList.remove('filled');
    });
  }
  if (target) {
    target.value = '';
  }
}

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
    clearPinBoxes('reg-pin-boxes', 'reg-pin');
    clearPinBoxes('reg-confirm-boxes', 'reg-confirm-pin');
    updatePinMatchIndicator();
    setTimeout(() => {
      document.getElementById('reg-username')?.focus();
    }, 50);
  } else {
    tabLoginBtn.classList.add('active');
    tabRegisterBtn.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    clearPinBoxes('login-pin-boxes', 'login-pin');

    if (prefilledUsername) {
      loginUsernameInput.value = prefilledUsername;
      const firstSlot = document.querySelector('#login-pin-boxes .pin-digit-slot');
      setTimeout(() => firstSlot?.focus(), 50);
    } else {
      setTimeout(() => loginUsernameInput?.focus(), 50);
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
  authFeedback.style.display = 'flex';
}

// Session Expiration Handler (7-day rule)
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

// Quick tab switch links in forms
document.getElementById('switch-to-register')?.addEventListener('click', () => openAuthModal('register'));
document.getElementById('switch-to-login')?.addEventListener('click', () => openAuthModal('login'));

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

  const submitBtn = document.getElementById('reg-submit-btn');
  const spinner = document.getElementById('reg-spinner');
  const btnText = submitBtn.querySelector('.btn-text');

  if (!username || username.length < 3) {
    showAuthFeedback('Username must be at least 3 characters.', 'error');
    document.getElementById('reg-username')?.focus();
    return;
  }

  if (!/^\d{4}$/.test(pin)) {
    showAuthFeedback('Please enter a valid 4-digit security PIN.', 'error');
    const firstSlot = document.querySelector('#reg-pin-boxes .pin-digit-slot');
    firstSlot?.focus();
    return;
  }

  if (pin !== confirmPin) {
    showAuthFeedback('PINs do not match. Please enter the same 4-digit PIN.', 'error');
    const confirmSlot = document.querySelector('#reg-confirm-boxes .pin-digit-slot');
    confirmSlot?.focus();
    return;
  }

  try {
    submitBtn.disabled = true;
    if (spinner) spinner.classList.remove('hidden');
    if (btnText) btnText.textContent = 'Creating Profile...';

    const res = await api.register(username, displayName, pin);
    currentUser = res.user;
    updateAuthUI();
    closeAuthModal();
    await fetchUserProfile();
    renderGamesScrollList();
  } catch (err) {
    showAuthFeedback(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    if (spinner) spinner.classList.add('hidden');
    if (btnText) btnText.textContent = 'Create Profile & Claim 100 Coins 🪙';
  }
});

// Login Form Submit
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = loginUsernameInput.value.trim();
  const pin = document.getElementById('login-pin').value.trim();

  const submitBtn = document.getElementById('login-submit-btn');
  const spinner = document.getElementById('login-spinner');
  const btnText = submitBtn.querySelector('.btn-text');

  if (!username) {
    showAuthFeedback('Please enter your username.', 'error');
    loginUsernameInput.focus();
    return;
  }

  if (!/^\d{4}$/.test(pin)) {
    showAuthFeedback('Please enter your 4-digit security PIN.', 'error');
    const firstSlot = document.querySelector('#login-pin-boxes .pin-digit-slot');
    firstSlot?.focus();
    return;
  }

  try {
    submitBtn.disabled = true;
    if (spinner) spinner.classList.remove('hidden');
    if (btnText) btnText.textContent = 'Unlocking Profile...';

    const res = await api.login(username, pin);
    currentUser = res.user;
    updateAuthUI();
    closeAuthModal();
    clearPinBoxes('login-pin-boxes', 'login-pin');
    await fetchUserProfile();
    renderGamesScrollList();
  } catch (err) {
    showAuthFeedback(err.message, 'error');
    clearPinBoxes('login-pin-boxes', 'login-pin');
    const firstSlot = document.querySelector('#login-pin-boxes .pin-digit-slot');
    firstSlot?.focus();
  } finally {
    submitBtn.disabled = false;
    if (spinner) spinner.classList.add('hidden');
    if (btnText) btnText.textContent = 'Unlock Profile 🔓';
  }
});

// Logout / Lock Action
btnLogout.addEventListener('click', () => {
  api.logout();
  currentUser = null;
  userUnlocks = {};
  userStats = {};
  todayCompletions = new Set();
  updateAuthUI();
  updateScoreDisplay();
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
    userStats = {};
    (res.stats || []).forEach(s => {
      userStats[s.game_id] = s;
    });
    todayCompletions = new Set();
    (res.todayCompletions || []).forEach(c => {
      todayCompletions.add(`${c.game_id}:${c.difficulty}`);
    });
    updateAuthUI();
    updateScoreDisplay();
  } catch (e) {
    console.warn('Profile fetch note:', e.message);
  }
}

// =========================================================================
// 2. FRONT PAGE & MODULAR GAMES SCROLL LIST
// =========================================================================
function isGameUnlocked(gameId) {
  const games = getAllGames();
  const game = games.find(g => g.id === gameId);
  if (game && game.isFree) return true;
  const record = userUnlocks[gameId];
  return record && record.game_unlocked === 1;
}

function isTierUnlocked(gameId, tier) {
  if (!isGameUnlocked(gameId)) return false;
  if (tier === 'easy') return true;
  if (gameId === 'wordle' && tier === 'playground') return true;
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

  // If game is locked
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

  updateScoreDisplay();

  // Reset to easy tier
  currentTier = 'easy';
  document.querySelectorAll('#tier-tabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tier === 'easy');
  });

  loadCurrentPuzzle();
  loadLeaderboard();
}

function returnToHome() {
  if (activeGameCleanup) {
    try { activeGameCleanup(); } catch {}
    activeGameCleanup = null;
  }
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

function loadCurrentPuzzle(isNewPlayground = false) {
  const dateStr = getTodayDateStr();

  // 1. Check if game itself is unlocked
  if (!isGameUnlocked(activeGameId)) {
    if (activeGameCleanup) {
      try { activeGameCleanup(); } catch {}
      activeGameCleanup = null;
    }
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
    if (activeGameCleanup) {
      try { activeGameCleanup(); } catch {}
      activeGameCleanup = null;
    }
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

  const isPlayground = currentTier === 'playground';
  const isAlreadyCompletedToday = !isPlayground && todayCompletions.has(`${activeGameId}:${currentTier}`);

  if (activeGameCleanup) {
    try { activeGameCleanup(); } catch (err) { console.warn('Game cleanup note:', err); }
    activeGameCleanup = null;
  }

  // 3. If daily tier is already completed today, show celebration view
  if (isAlreadyCompletedToday) {
    gameBadge.textContent = `Daily ${currentTier.toUpperCase()} (${dateStr}) · Completed`;
    statusEl.textContent = 'Completed for today';
    statusEl.style.color = 'var(--correct-bg)';
    newGameBtn.style.display = 'none';

    gameArenaContent.innerHTML = `
      <div class="daily-completed-view">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
        <h3 style="font-size: 1.4rem; color: #166534; margin-bottom: 0.5rem;">
          Daily ${currentTier.toUpperCase()} Challenge Solved!
        </h3>
        <p style="color: #15803d; font-size: 0.95rem; max-width: 480px; margin: 0 auto 1.5rem auto; line-height: 1.5;">
          You have already conquered today's ${currentTier} daily challenge and claimed your rewards. Daily puzzles refresh every midnight UTC.
        </p>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <button id="btn-jump-playground" class="game-action-btn btn-play" style="max-width: 280px;">
            Play Unlimited Playground 🎲
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-jump-playground')?.addEventListener('click', () => {
      const playgroundTab = document.querySelector('#tier-tabs .tab-btn[data-tier="playground"]');
      if (playgroundTab) playgroundTab.click();
    });

    gameRulesBox.innerHTML = `<h3>Daily Challenge Rules</h3><p>Daily puzzles can be solved once per day for coins and daily leaderboard standing. Unlimited practice is available in Playground mode.</p>`;
    return;
  }

  // 4. Set up puzzle for play
  newGameBtn.style.display = 'inline-block';
  if (isPlayground) {
    newGameBtn.textContent = '🎲 New Game';
    // Pass previous puzzle solution so playground produces a different game/word
    const prevWord = currentPuzzle?.targetWord;
    currentPuzzle = getPlaygroundPuzzle(activeGameId, prevWord);
    gameBadge.textContent = 'Playground Mode (Unranked · Unlimited)';
  } else {
    newGameBtn.textContent = '↺ Reset Puzzle';
    currentPuzzle = getDailyPuzzle(activeGameId, currentTier, dateStr);
    gameBadge.textContent = `Daily ${currentTier.toUpperCase()} (${dateStr})`;
  }

  startTime = Date.now();

  // Mount the active game dynamically via plug-and-play lifecycle
  const game = getGameConfig(activeGameId);
  if (typeof game.mount === 'function') {
    activeGameCleanup = game.mount(gameArenaContent, currentPuzzle, {
      onWin: (score, timeTakenMs) => handleGameWin(activeGameId, currentTier, score, timeTakenMs),
      showStatus: (msg, color) => showStatus(msg, color),
      setRules: (html) => { gameRulesBox.innerHTML = html; }
    });
  } else {
    gameArenaContent.innerHTML = `<p style="color:var(--danger); padding:2rem; text-align:center;">Game '${activeGameId}' has no mount lifecycle defined.</p>`;
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
// 4. UNIFIED GAME WIN & SCORE SYNC
// =========================================================================
async function handleGameWin(gameId, tier, earnedPoints, customTimeTakenMs) {
  const timeTakenMs = customTimeTakenMs || Math.max(1500, Date.now() - startTime);

  try {
    const res = await api.submitScore({
      gameId,
      difficulty: tier,
      score: earnedPoints,
      timeTakenMs,
      dateStr: getTodayDateStr(),
    });

    if (tier !== 'playground') {
      todayCompletions.add(`${gameId}:${tier}`);
    }

    if (res.stats) {
      userStats[gameId] = res.stats;
    } else {
      const currentStats = userStats[gameId] || { total_score: 0, plays_count: 0, best_score: 0 };
      userStats[gameId] = {
        ...currentStats,
        total_score: (currentStats.total_score || 0) + earnedPoints,
        plays_count: (currentStats.plays_count || 0) + 1,
        best_score: Math.max(currentStats.best_score || 0, earnedPoints),
      };
    }
    updateScoreDisplay();

    if (res.coinsAwarded > 0) {
      currentUser.coins = res.currentCoins;
      currentUser.streakCount = res.streakCount;
      updateAuthUI();
      showStatus(`🎉 Solved! +${earnedPoints} Pts & +${res.coinsAwarded} Coins Earned!`, "var(--correct-bg)");
    } else {
      showStatus(`🎉 Solved! +${earnedPoints} Pts recorded!`, "var(--correct-bg)");
    }

    loadLeaderboard();

    // If it was a daily tier, transition to completed daily screen after celebratory delay
    if (tier !== 'playground') {
      setTimeout(() => {
        loadCurrentPuzzle();
      }, 1800);
    }
  } catch (e) {
    console.warn('Score submission sync note:', e.message);
    if (e.code === 'DAILY_ALREADY_COMPLETED') {
      todayCompletions.add(`${gameId}:${tier}`);
      showStatus('Challenge already completed today. Try Playground mode!', 'var(--warning)');
      setTimeout(() => {
        loadCurrentPuzzle();
      }, 1500);
    }
  }
}

function showStatus(msg, color) {
  statusEl.innerText = msg;
  if (color) statusEl.style.color = color;
}

function updateScoreDisplay() {
  const stats = userStats[activeGameId] || { total_score: 0, plays_count: 0 };
  totalScoreEl.innerText = stats.total_score ?? 0;
  gamesWonEl.innerText = stats.plays_count ?? 0;
}

newGameBtn.addEventListener('click', () => {
  loadCurrentPuzzle(currentTier === 'playground');
});

// =========================================================================
// 5. LIVE LEADERBOARDS
// =========================================================================
async function loadLeaderboard() {
  const view = document.getElementById('leaderboard-view');
  try {
    const data = await api.getLeaderboard(activeGameId);
    renderLeaderboardView(data);
  } catch (err) {
    console.error('Leaderboard load error:', err);
    view.innerHTML = `<p style="color: var(--danger); font-size: 0.85rem;">Failed to load leaderboard: ${err.message || 'Server error'}</p>`;
  }
}

function renderLeaderboardView(data) {
  const view = document.getElementById('leaderboard-view');
  const isGlobal = document.getElementById('btn-global-tab').classList.contains('active');

  if (isGlobal) {
    const rows = data.globalLeaderboard || [];
    if (!rows.length) {
      view.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No players ranked yet for this game. Be the first to play and claim #1!</p>';
      return;
    }
    view.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th style="width: 14%;">Rank</th>
            <th>Player</th>
            <th style="text-align: right;">Avg Score</th>
            <th style="text-align: right;" title="Tie Breaker: Total Games Played">Games Played</th>
            <th style="text-align: right;">Best Score</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => {
            const isMe = currentUser && (r.user_id === currentUser.id || r.username === currentUser.username);
            const rankLabel = i === 0 ? '🥇 #1' : i === 1 ? '🥈 #2' : i === 2 ? '🥉 #3' : `#${i + 1}`;
            const youTag = isMe ? `<span class="you-badge">You</span>` : '';
            return `
              <tr class="${isMe ? 'leaderboard-row-me' : ''}">
                <td><strong>${rankLabel}</strong></td>
                <td><strong>${r.display_name || r.username}</strong> ${youTag}</td>
                <td style="text-align: right;"><strong style="color:var(--accent); font-size:1.05rem;">${r.global_average_score}</strong></td>
                <td style="text-align: right; font-weight: 700; color: var(--text-muted);">${r.plays_count}</td>
                <td style="text-align: right;">${r.best_score}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>`;
  } else {
    const rows = data.dailyLeaderboard || [];
    if (!rows.length) {
      view.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No daily entries recorded yet today. Solve today\'s challenge to rank!</p>';
      return;
    }
    view.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th style="width: 14%;">Rank</th>
            <th>Player</th>
            <th>Tier</th>
            <th style="text-align: right;">Score</th>
            <th style="text-align: right;">Time</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => {
            const isMe = currentUser && (r.user_id === currentUser.id || r.username === currentUser.username);
            const rankLabel = i === 0 ? '🥇 #1' : i === 1 ? '🥈 #2' : i === 2 ? '🥉 #3' : `#${i + 1}`;
            const youTag = isMe ? `<span class="you-badge">You</span>` : '';
            return `
              <tr class="${isMe ? 'leaderboard-row-me' : ''}">
                <td><strong>${rankLabel}</strong></td>
                <td><strong>${r.display_name || r.username}</strong> ${youTag}</td>
                <td><span style="text-transform:capitalize; padding: 2px 8px; border-radius:6px; background:#f1f5f9; font-weight:700; font-size:0.8rem;">${r.difficulty}</span></td>
                <td style="text-align: right;"><strong style="color:var(--correct-bg); font-size:1.05rem;">${r.score}</strong></td>
                <td style="text-align: right;">${(r.time_taken_ms / 1000).toFixed(1)}s</td>
              </tr>
            `;
          }).join('')}
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
// 6. INITIAL BOOTSTRAP
// =========================================================================
async function bootstrap() {
  setupPinInputs();
  updateAuthUI();
  await fetchUserProfile();
  renderGamesScrollList();
}

bootstrap();
