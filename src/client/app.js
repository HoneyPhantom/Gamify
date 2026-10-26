import { getAllGames, getGameConfig, getDailyPuzzle, getPlaygroundPuzzle, getTodayDateStr } from '../games/index.js';
import { api } from './api.js';

// =========================================================================
// APPLICATION STATE
// =========================================================================
let currentUser = api.getCachedUser();
let userUnlocks = {}; // Map of gameId -> unlock record
let userStats = {}; // Map of gameId -> user_game_stats record { total_score, plays_count, best_score, average_score, best_streak }
let todayCompletions = new Set(); // Set of "gameId:difficulty" completed today

let activeGameId = 'wordle';
let currentTier = 'easy';
let currentPuzzle = null;
let startTime = Date.now();
let activeGameCleanup = null; // Holds the cleanup function of the currently mounted game
let gameTimerInterval = null;

let userBadges = []; // List of unlocked badge_id strings
let currentFriendsCache = [];
let currentPublicUser = null;

const ALL_BADGES = [
  { id: 'wordsmith', name: 'Wordsmith', icon: '🧠', desc: 'Solve 5 Wordle puzzles' },
  { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', desc: 'Solve any daily puzzle in < 30s' },
  { id: 'inferno', name: 'Inferno', icon: '🔥', desc: 'Reach a 3-day daily streak' },
  { id: 'triple_crown', name: 'Triple Crown', icon: '🏆', desc: 'Complete the Daily Sweep (all 3 in 1 day)' },
  { id: 'diamond_mind', name: 'Diamond Mind', icon: '💎', desc: 'Accumulate 300+ coins' },
  { id: 'perfectionist', name: 'Perfectionist', icon: '🎯', desc: 'Solve Wordle in <= 3 guesses' },
  { id: 'pathfinder', name: 'Pathfinder', icon: '🗺️', desc: 'Solve 5 Number Trail puzzles' },
  { id: 'social_butterfly', name: 'Social Butterfly', icon: '👥', desc: 'Connect with a friend on Gamify' },
];

// DOM Elements
const frontPageView = document.getElementById('front-page-view');
const gameView = document.getElementById('game-view');
const gamesScrollList = document.getElementById('games-scroll-list');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const brandLogo = document.getElementById('brand-logo');

const gameTimerEl = document.getElementById('game-timer');
const speedBonusEl = document.getElementById('speed-bonus-indicator');

// Daily Sweep Elements
const sweepStatusDesc = document.getElementById('sweep-status-desc');
const sweepStatusWordle = document.getElementById('sweep-status-wordle');
const sweepStatusNumberGrid = document.getElementById('sweep-status-number-grid');
const sweepStatusNumberTrail = document.getElementById('sweep-status-number-trail');
const sweepItemWordle = document.getElementById('sweep-item-wordle');
const sweepItemNumberGrid = document.getElementById('sweep-item-number-grid');
const sweepItemNumberTrail = document.getElementById('sweep-item-number-trail');

// Badge Celebration Modal Elements
const badgeUnlockModal = document.getElementById('badge-unlock-modal');
const badgeUnlockIcon = document.getElementById('badge-unlock-icon');
const badgeUnlockName = document.getElementById('badge-unlock-name');
const badgeUnlockDesc = document.getElementById('badge-unlock-desc');
const badgeUnlockClose = document.getElementById('badge-unlock-close');

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

// Search & Profile DOM Elements
const gameSearchInput = document.getElementById('game-search-input');
const playerSearchInput = document.getElementById('player-search-input');
const playerSearchDropdown = document.getElementById('player-search-dropdown');
const btnOpenProfile = document.getElementById('btn-open-profile');

const profileModal = document.getElementById('profile-modal');
const profileModalClose = document.getElementById('profile-modal-close');
const profileDisplayName = document.getElementById('profile-display-name');
const profileUsername = document.getElementById('profile-username');
const profileAboutInput = document.getElementById('profile-about-input');
const btnSaveProfile = document.getElementById('btn-save-profile');
const profileStreaksGrid = document.getElementById('profile-streaks-grid');
const addFriendInput = document.getElementById('add-friend-input');
const btnAddFriend = document.getElementById('btn-add-friend');
const profileFriendsList = document.getElementById('profile-friends-list');
const profileFriendsFeedback = document.getElementById('profile-friends-feedback');

const publicProfileModal = document.getElementById('public-profile-modal');
const publicProfileClose = document.getElementById('public-profile-close');
const publicProfileGamertag = document.getElementById('public-profile-gamertag');
const publicProfileHandle = document.getElementById('public-profile-handle');
const publicProfileAbout = document.getElementById('public-profile-about');
const btnToggleFriendPublic = document.getElementById('btn-toggle-friend-public');

const rulesModal = document.getElementById('rules-modal');
const rulesModalClose = document.getElementById('rules-modal-close');
const rulesModalContent = document.getElementById('rules-modal-content');
const btnOpenRules = document.getElementById('btn-open-rules');

const btnGlobalTab = document.getElementById('btn-global-tab');
const btnFriendsTab = document.getElementById('btn-friends-tab');
const btnDailyTab = document.getElementById('btn-daily-tab');
const btnTournamentTab = document.getElementById('btn-tournament-tab');

// P2 XP, Level & Cosmetics DOM Elements
const headerUserLevel = document.getElementById('header-user-level');
const headerXpBadge = document.getElementById('header-xp-badge');
const profileAvatar = document.getElementById('profile-avatar');
const profileCustomTitle = document.getElementById('profile-custom-title');
const profileUserLevel = document.getElementById('profile-user-level');
const profileLevelTitle = document.getElementById('profile-level-title');
const profileXpFill = document.getElementById('profile-xp-fill');
const profileXpText = document.getElementById('profile-xp-text');
const profileHeatmap = document.getElementById('profile-heatmap');

const publicProfileAvatar = document.getElementById('public-profile-avatar');
const publicProfileCustomTitle = document.getElementById('public-profile-custom-title');
const publicProfileLevel = document.getElementById('public-profile-level');
const publicProfileHeatmap = document.getElementById('public-profile-heatmap');

// Cosmetic Shop DOM Elements
const btnOpenShop = document.getElementById('btn-open-shop');
const shopModal = document.getElementById('shop-modal');
const shopModalClose = document.getElementById('shop-modal-close');
const shopCoinBalance = document.getElementById('shop-coin-balance');
const shopTabs = document.getElementById('shop-tabs');
const shopItemsContainer = document.getElementById('shop-items-container');

// P3 PvP Challenges & Activity Feed DOM Elements
const btnOpenChallenges = document.getElementById('btn-open-challenges');
const headerChallengesBadge = document.getElementById('header-challenges-badge');
const challengesModal = document.getElementById('challenges-modal');
const challengesModalClose = document.getElementById('challenges-modal-close');
const challengesTabs = document.getElementById('challenges-tabs');
const challengesItemsContainer = document.getElementById('challenges-items-container');
const challengesPendingCount = document.getElementById('challenges-pending-count');

const createChallengeModal = document.getElementById('create-challenge-modal');
const createChallengeModalClose = document.getElementById('create-challenge-modal-close');
const createChallengeForm = document.getElementById('create-challenge-form');
const challengeOpponentInput = document.getElementById('challenge-opponent-input');
const challengeGameSelect = document.getElementById('challenge-game-select');
const challengeTierSelect = document.getElementById('challenge-tier-select');
const challengeTargetScore = document.getElementById('challenge-target-score');
const btnChallengePublic = document.getElementById('btn-challenge-public');

const activeChallengeBanner = document.getElementById('active-challenge-banner');
const activeChallengeText = document.getElementById('active-challenge-text');
const btnCancelChallengePlay = document.getElementById('btn-cancel-challenge-play');

const friendsActivityFeed = document.getElementById('friends-activity-feed');
const btnRefreshFeed = document.getElementById('btn-refresh-feed');

let activeChallenge = null;
let activeChallengeTab = 'incoming';
let challengesCache = { incoming: [], sent: [], pendingIncoming: [], completedIncoming: [] };

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
      slot.addEventListener('input', () => {
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
  const matchStatusEl = document.getElementById('reg-pin-match-status');
  if (!matchStatusEl) return;

  if (!confirmPin) {
    matchStatusEl.textContent = '';
    matchStatusEl.className = 'pin-match-indicator';
    return;
  }

  if (regPin === confirmPin && regPin.length === 4) {
    matchStatusEl.textContent = '✓ PINs Match';
    matchStatusEl.className = 'pin-match-indicator match';
  } else {
    matchStatusEl.textContent = '⚠️ PINs do not match';
    matchStatusEl.className = 'pin-match-indicator mismatch';
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
  if (currentUser && api.token) {
    authStateLoggedIn.classList.remove('hidden');
    authStateLoggedOut.classList.add('hidden');
    coinBalanceEl.textContent = currentUser.coins ?? 100;
    streakCountEl.textContent = currentUser.streakCount ?? 0;
    navUserNameEl.textContent = currentUser.displayName || currentUser.username;
    updateLevelUI();
    applyEquippedCosmetics();
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

// Session Expiration Handler
api.onSessionExpired = (username) => {
  currentUser = null;
  updateAuthUI();
  renderGamesScrollList();
  openAuthModal('login', username || '', '🔒 Enter your 4-digit PIN to continue your streaks and coin progress.');
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
    loadChallenges();
    loadActivityFeed();
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
    loadChallenges();
    loadActivityFeed();
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
  if (!api.token) return;
  try {
    const res = await api.getMe();
    currentUser = {
      ...res.user,
      coins: res.user.coins,
      streakCount: res.user.streak_count,
      displayName: res.user.display_name,
      username: res.user.username,
      about: res.user.about || '',
      xp: res.user.xp || 0,
      selected_frame: res.user.selected_frame || 'default',
      selected_title: res.user.selected_title || '',
      activityHistory: res.activityHistory || [],
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
    userBadges = res.badges || [];
    updateAuthUI();
    updateScoreDisplay();
    updateDailySweepUI();
    if (res.levelInfo) {
      updateLevelUI(res.levelInfo);
    } else {
      updateLevelUI();
    }
    applyEquippedCosmetics();
  } catch (e) {
    console.warn('Profile fetch note:', e.message);
  }
}

// =========================================================================
// 2. FRONT PAGE & MODULAR GAMES SCROLL LIST (Instant Search & Thumbnails)
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

function renderGamesScrollList(searchQuery = '') {
  let games = getAllGames();
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    games = games.filter(g =>
      (g.title || '').toLowerCase().includes(q) ||
      (g.description || '').toLowerCase().includes(q)
    );
  }
  gamesScrollList.innerHTML = '';

  if (games.length === 0) {
    gamesScrollList.innerHTML = `
      <div style="padding: 2.5rem 1rem; color: var(--text-muted); text-align: center; width: 100%; font-weight: 600;">
        No games matching "${searchQuery}"
      </div>
    `;
    return;
  }

  games.forEach(game => {
    const unlocked = isGameUnlocked(game.id);
    const stats = userStats[game.id] || {};
    const currentStreak = stats.current_streak ?? 0;

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
      <div class="game-cover-container">
        <img src="${game.thumbnail || '/images/gamify-logo.png'}" class="game-cover-img" alt="${game.title}" />
        <div class="game-card-overlay-top">
          <div class="game-streak-pill" title="Current Daily Streak">🔥 ${currentStreak} Streak</div>
          ${statusHtml}
        </div>
      </div>
      <div class="game-card-body">
        <div>
          <h3 class="game-card-title">${game.title}</h3>
          <p class="game-card-desc">${game.description}</p>
          <div class="game-card-tiers">
            <span>🎯 Easy · Medium · Hard · Playground</span>
          </div>
        </div>
        <div>
          ${actionBtnHtml}
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      handleGameCardClick(game);
    });

    gamesScrollList.appendChild(card);
  });
}

// Client-side instant game search (0 Worker calls)
gameSearchInput?.addEventListener('input', () => {
  renderGamesScrollList(gameSearchInput.value.trim());
});

async function handleGameCardClick(game) {
  // If not logged in, prompt user to log in or create profile
  if (!currentUser) {
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
    renderGamesScrollList(gameSearchInput?.value?.trim() || '');
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
  stopPuzzleTimer();
  if (activeGameCleanup) {
    try { activeGameCleanup(); } catch {}
    activeGameCleanup = null;
  }
  gameView.classList.add('hidden');
  frontPageView.classList.remove('hidden');
  updateDailySweepUI();
  renderGamesScrollList(gameSearchInput?.value?.trim() || '');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

backToHomeBtn.addEventListener('click', returnToHome);
brandLogo.addEventListener('click', returnToHome);

// =========================================================================
// P1 HELPERS: TIMER, DAILY SWEEP & BADGES CELEBRATION
// =========================================================================

function startPuzzleTimer() {
  if (gameTimerInterval) clearInterval(gameTimerInterval);
  startTime = Date.now();
  if (gameTimerEl) gameTimerEl.textContent = '00:00';
  if (speedBonusEl) {
    speedBonusEl.textContent = '+50 Pts';
    speedBonusEl.style.color = 'var(--correct-bg)';
  }

  gameTimerInterval = setInterval(() => {
    const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
    const m = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
    const s = String(elapsedSec % 60).padStart(2, '0');
    if (gameTimerEl) gameTimerEl.textContent = `${m}:${s}`;

    if (speedBonusEl) {
      if (elapsedSec < 30) {
        speedBonusEl.textContent = '+50 Pts';
        speedBonusEl.style.color = 'var(--correct-bg)';
      } else if (elapsedSec < 60) {
        speedBonusEl.textContent = '+25 Pts';
        speedBonusEl.style.color = 'var(--warning)';
      } else if (elapsedSec < 120) {
        speedBonusEl.textContent = '+10 Pts';
        speedBonusEl.style.color = 'var(--accent)';
      } else {
        speedBonusEl.textContent = '+0 Pts';
        speedBonusEl.style.color = 'var(--text-muted)';
      }
    }
  }, 1000);
}

function stopPuzzleTimer() {
  if (gameTimerInterval) {
    clearInterval(gameTimerInterval);
    gameTimerInterval = null;
  }
}

function updateDailySweepUI() {
  if (!sweepStatusWordle || !sweepStatusNumberGrid || !sweepStatusNumberTrail) return;

  const hasWordle = Array.from(todayCompletions).some(c => c.startsWith('wordle:'));
  const hasGrid = Array.from(todayCompletions).some(c => c.startsWith('number-grid:'));
  const hasTrail = Array.from(todayCompletions).some(c => c.startsWith('number-trail:'));

  sweepItemWordle?.classList.toggle('completed', hasWordle);
  if (sweepStatusWordle) sweepStatusWordle.textContent = hasWordle ? '✅' : '⏳';

  sweepItemNumberGrid?.classList.toggle('completed', hasGrid);
  if (sweepStatusNumberGrid) sweepStatusNumberGrid.textContent = hasGrid ? '✅' : '⏳';

  sweepItemNumberTrail?.classList.toggle('completed', hasTrail);
  if (sweepStatusNumberTrail) sweepStatusNumberTrail.textContent = hasTrail ? '✅' : '⏳';

  const completedCount = (hasWordle ? 1 : 0) + (hasGrid ? 1 : 0) + (hasTrail ? 1 : 0);
  if (completedCount === 3) {
    if (sweepStatusDesc) sweepStatusDesc.textContent = '🎉 All 3 daily challenges conquered today! +50 Daily Sweep Bonus Claimed!';
  } else {
    if (sweepStatusDesc) sweepStatusDesc.textContent = `Completed ${completedCount}/3 daily puzzles. Conquer all 3 today for +50 Bonus Coins!`;
  }
}

function renderBadgesGrid(containerEl, unlockedBadgeIds = []) {
  if (!containerEl) return;
  const unlockedSet = new Set(unlockedBadgeIds);
  containerEl.innerHTML = ALL_BADGES.map(b => {
    const isUnlocked = unlockedSet.has(b.id);
    return `
      <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}" title="${isUnlocked ? 'Unlocked!' : 'Locked'}">
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      </div>
    `;
  }).join('');
}

function showBadgeUnlockCelebration(newBadges) {
  if (!newBadges || newBadges.length === 0 || !badgeUnlockModal) return;
  const firstBadge = newBadges[0];
  if (badgeUnlockIcon) badgeUnlockIcon.textContent = firstBadge.icon || '🏆';
  if (badgeUnlockName) badgeUnlockName.textContent = firstBadge.name || 'Badge Unlocked';
  if (badgeUnlockDesc) badgeUnlockDesc.textContent = firstBadge.description || firstBadge.desc || 'Great job!';

  badgeUnlockModal.classList.remove('hidden');

  // Add to local userBadges
  newBadges.forEach(b => {
    if (!userBadges.includes(b.id)) userBadges.push(b.id);
  });
}

badgeUnlockClose?.addEventListener('click', () => badgeUnlockModal?.classList.add('hidden'));
badgeUnlockModal?.addEventListener('click', (e) => {
  if (e.target === badgeUnlockModal) badgeUnlockModal.classList.add('hidden');
});

// =========================================================================
// P2 HELPERS: XP LEVELING, COSMETICS, ACTIVITY HEATMAP & SHOP
// =========================================================================

function calculateClientLevel(xp = 0) {
  const level = Math.max(1, Math.floor(Math.sqrt(xp / 25)) + 1);
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 25;
  const xpForNextLevel = Math.pow(level, 2) * 25;
  let title = 'Novice';
  if (level >= 20) title = 'Grandmaster';
  else if (level >= 15) title = 'Master';
  else if (level >= 10) title = 'Expert';
  else if (level >= 7) title = 'Adept';
  else if (level >= 4) title = 'Apprentice';
  return { level, currentXp: xp, xpForCurrentLevel, xpForNextLevel, title };
}

function updateLevelUI(levelInfo) {
  if (!levelInfo) {
    levelInfo = calculateClientLevel(currentUser?.xp || 0);
  }
  if (headerUserLevel) {
    headerUserLevel.textContent = `Lvl ${levelInfo.level}`;
  }
  if (profileUserLevel) {
    profileUserLevel.textContent = `Lvl ${levelInfo.level}`;
  }
  if (profileLevelTitle) {
    profileLevelTitle.textContent = levelInfo.title;
  }
  if (profileXpFill && profileXpText) {
    const range = (levelInfo.xpForNextLevel - levelInfo.xpForCurrentLevel) || 1;
    const progress = Math.min(100, Math.max(0, Math.round(((levelInfo.currentXp - levelInfo.xpForCurrentLevel) / range) * 100)));
    profileXpFill.style.width = `${progress}%`;
    profileXpText.textContent = `${levelInfo.currentXp} / ${levelInfo.xpForNextLevel} XP (${progress}%)`;
  }
}

const TITLE_NAME_MAP = {
  title_prodigy: 'Puzzle Prodigy',
  title_wizard: 'Word Wizard',
  title_grandmaster: 'Grid Grandmaster',
  title_mythic: 'Mythic Solver',
};

function formatTitleName(titleId) {
  if (!titleId) return '';
  return TITLE_NAME_MAP[titleId] || titleId;
}

function applyCosmeticToAvatar(avatarEl, frameId) {
  if (!avatarEl) return;
  const classesToRemove = [];
  avatarEl.classList.forEach(cls => {
    if (cls.startsWith('frame-')) classesToRemove.push(cls);
  });
  classesToRemove.forEach(cls => avatarEl.classList.remove(cls));

  if (frameId && frameId !== 'default') {
    avatarEl.classList.add(`frame-${frameId}`);
  }
}

function applyEquippedCosmetics() {
  if (!currentUser) return;
  applyCosmeticToAvatar(profileAvatar, currentUser.selected_frame);
  if (profileCustomTitle) {
    if (currentUser.selected_title) {
      profileCustomTitle.textContent = formatTitleName(currentUser.selected_title);
      profileCustomTitle.classList.remove('hidden');
    } else {
      profileCustomTitle.classList.add('hidden');
    }
  }
}

function renderCalendarHeatmap(containerEl, activityMap = {}) {
  if (!containerEl) return;
  containerEl.innerHTML = '';

  const days = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    days.push(dateStr);
  }

  containerEl.innerHTML = days.map(dateStr => {
    const count = activityMap[dateStr] || 0;
    let tier = 'l0';
    if (count >= 3) tier = 'l3';
    else if (count === 2) tier = 'l2';
    else if (count === 1) tier = 'l1';

    const label = `${dateStr}: ${count} puzzle${count === 1 ? '' : 's'} solved`;
    return `<div class="heatmap-cell ${tier}" title="${label}"></div>`;
  }).join('');
}

// Cosmetic Shop State & Logic
let shopCatalog = [];
let shopOwned = new Set();
let activeShopTab = 'frame';

async function openShopModal() {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }
  try {
    if (shopCoinBalance) shopCoinBalance.textContent = currentUser.coins ?? 0;
    shopModal?.classList.remove('hidden');
    const res = await api.getShop();
    shopCatalog = res.catalog || [];
    shopOwned = new Set(res.owned || []);
    if (shopCoinBalance) shopCoinBalance.textContent = res.coins ?? currentUser.coins ?? 0;
    renderShopItems(activeShopTab);
  } catch (err) {
    console.error('Failed to load shop:', err);
    alert('Failed to load cosmetic shop: ' + (err.message || 'Server error'));
  }
}

function renderShopItems(tab) {
  if (!shopItemsContainer) return;
  const filtered = shopCatalog.filter(i => i.type === tab);
  if (filtered.length === 0) {
    shopItemsContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding: 2rem; color: var(--text-muted);">No items in this category.</div>`;
    return;
  }

  const currentCoins = currentUser?.coins ?? 0;
  const isFrameTab = tab === 'frame';
  const currentlyEquippedId = isFrameTab ? (currentUser?.selected_frame || 'default') : (currentUser?.selected_title || '');

  let unequipHtml = '';
  if (isFrameTab && currentlyEquippedId !== 'default') {
    unequipHtml = `
      <div class="shop-card" style="border-style: dashed;">
        <div class="shop-card-preview">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: #94a3b8; display:flex; align-items:center; justify-content:center; color:#fff;">👤</div>
        </div>
        <div class="shop-card-title">Default Frame</div>
        <div class="shop-card-desc">Reset to standard avatar appearance</div>
        <div class="shop-card-footer">
          <span></span>
          <button class="btn-shop-unequip game-action-btn" data-type="frame" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; background: #e2e8f0; color: #475569;">Unequip Frame</button>
        </div>
      </div>
    `;
  } else if (!isFrameTab && currentlyEquippedId !== '') {
    unequipHtml = `
      <div class="shop-card" style="border-style: dashed;">
        <div class="shop-card-preview">
          <span style="font-size: 0.85rem; color: var(--text-muted);">No Title</span>
        </div>
        <div class="shop-card-title">Clear Title</div>
        <div class="shop-card-desc">Remove active gamertag title</div>
        <div class="shop-card-footer">
          <span></span>
          <button class="btn-shop-unequip game-action-btn" data-type="title" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; background: #e2e8f0; color: #475569;">Unequip Title</button>
        </div>
      </div>
    `;
  }

  shopItemsContainer.innerHTML = unequipHtml + filtered.map(item => {
    const isOwned = shopOwned.has(item.id);
    const isEquipped = currentlyEquippedId === item.id;
    const canAfford = currentCoins >= item.cost;

    let previewHtml = '';
    if (item.type === 'frame') {
      previewHtml = `
        <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #0284c7, #38bdf8); display:flex; align-items:center; justify-content:center; color:#fff;" class="frame-${item.id}">
          🎮
        </div>
      `;
    } else {
      previewHtml = `
        <span class="player-custom-title" style="font-size: 0.82rem; padding: 4px 10px;">${item.name}</span>
      `;
    }

    let actionBtn = '';
    if (isEquipped) {
      actionBtn = `<span style="font-size: 0.8rem; font-weight: 800; color: #16a34a;">Equipped ✓</span>`;
    } else if (isOwned) {
      actionBtn = `<button class="btn-shop-equip game-action-btn btn-play" data-id="${item.id}" data-type="${item.type}" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">Equip</button>`;
    } else {
      actionBtn = `<button class="btn-shop-buy game-action-btn ${canAfford ? 'btn-unlock-gold' : 'btn-lock'}" data-id="${item.id}" data-cost="${item.cost}" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;" ${canAfford ? '' : 'title="Not enough coins"'}>Buy for ${item.cost} 🪙</button>`;
    }

    return `
      <div class="shop-card ${isEquipped ? 'equipped' : ''}">
        <div class="shop-card-preview">${previewHtml}</div>
        <div>
          <div class="shop-card-title">${item.name}</div>
          <div class="shop-card-desc">${item.description}</div>
        </div>
        <div class="shop-card-footer">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--gold);">${isOwned ? 'Owned' : `${item.cost} Coins`}</span>
          ${actionBtn}
        </div>
      </div>
    `;
  }).join('');

  // Attach handlers
  shopItemsContainer.querySelectorAll('.btn-shop-buy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const itemId = btn.dataset.id;
      btn.disabled = true;
      btn.textContent = 'Purchasing...';
      try {
        const res = await api.buyCosmetic(itemId);
        currentUser.coins = res.remainingCoins;
        shopOwned.add(itemId);
        updateAuthUI();
        if (shopCoinBalance) shopCoinBalance.textContent = currentUser.coins;
        renderShopItems(tab);
      } catch (err) {
        alert(err.message || 'Failed to purchase cosmetic item');
        btn.disabled = false;
        renderShopItems(tab);
      }
    });
  });

  shopItemsContainer.querySelectorAll('.btn-shop-equip').forEach(btn => {
    btn.addEventListener('click', async () => {
      const itemId = btn.dataset.id;
      const type = btn.dataset.type;
      btn.disabled = true;
      btn.textContent = 'Equipping...';
      try {
        const payload = type === 'frame' ? { frame: itemId } : { title: itemId };
        const res = await api.equipCosmetic(payload);
        if (type === 'frame') currentUser.selected_frame = res.selectedFrame;
        else currentUser.selected_title = res.selectedTitle;
        applyEquippedCosmetics();
        renderShopItems(tab);
      } catch (err) {
        alert(err.message || 'Failed to equip cosmetic item');
        btn.disabled = false;
        renderShopItems(tab);
      }
    });
  });

  shopItemsContainer.querySelectorAll('.btn-shop-unequip').forEach(btn => {
    btn.addEventListener('click', async () => {
      const type = btn.dataset.type;
      btn.disabled = true;
      try {
        const payload = type === 'frame' ? { frame: 'default' } : { title: '' };
        const res = await api.equipCosmetic(payload);
        if (type === 'frame') currentUser.selected_frame = res.selectedFrame;
        else currentUser.selected_title = res.selectedTitle;
        applyEquippedCosmetics();
        renderShopItems(tab);
      } catch (err) {
        alert(err.message || 'Failed to unequip cosmetic item');
        btn.disabled = false;
        renderShopItems(tab);
      }
    });
  });
}

btnOpenShop?.addEventListener('click', openShopModal);
shopModalClose?.addEventListener('click', () => shopModal?.classList.add('hidden'));
shopModal?.addEventListener('click', (e) => {
  if (e.target === shopModal) shopModal?.classList.add('hidden');
});
shopTabs?.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  shopTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeShopTab = btn.dataset.tab;
  renderShopItems(activeShopTab);
});

// =========================================================================
// P3 HELPERS: PVP CHALLENGES & FRIENDS LIVE ACTIVITY FEED
// =========================================================================

function formatRelativeTime(isoString) {
  if (!isoString) return 'Just now';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

async function loadActivityFeed() {
  if (!friendsActivityFeed) return;
  if (!currentUser || !api.token) {
    friendsActivityFeed.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 1rem;">Log in to view live friends activity!</div>';
    return;
  }
  try {
    const res = await api.getActivityFeed();
    const feed = res.feed || [];
    if (feed.length === 0) {
      friendsActivityFeed.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 1rem;">No recent friend activity yet. Add friends or solve daily puzzles to see live feed updates!</div>';
      return;
    }

    friendsActivityFeed.innerHTML = feed.map(item => {
      const u = item.user;
      const frameClass = u.selectedFrame && u.selectedFrame !== 'default' ? `frame-${u.selectedFrame}` : '';
      const titleTag = u.selectedTitle ? `<span class="player-custom-title" style="font-size:0.65rem; padding:1px 6px;">${formatTitleName(u.selectedTitle)}</span>` : '';
      return `
        <div class="feed-card">
          <div class="feed-card-icon">${item.icon || '⚡'}</div>
          <div class="feed-card-content">
            <strong style="cursor: pointer;" class="feed-user-link" data-username="${u.username}">${u.displayName || u.username}</strong>
            ${titleTag}
            <span>${item.text}</span>
          </div>
          <div class="feed-card-time">${formatRelativeTime(item.timestamp)}</div>
        </div>
      `;
    }).join('');

    friendsActivityFeed.querySelectorAll('.feed-user-link').forEach(link => {
      link.addEventListener('click', () => {
        openPublicProfile(link.dataset.username);
      });
    });
  } catch (err) {
    console.warn('Failed to load activity feed:', err);
    friendsActivityFeed.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 1rem;">Could not load live feed right now.</div>';
  }
}

btnRefreshFeed?.addEventListener('click', loadActivityFeed);

// Challenges System
async function loadChallenges() {
  if (!currentUser || !api.token) return;
  try {
    const res = await api.getChallenges();
    challengesCache = res;

    if (headerChallengesBadge) {
      if (res.pendingCount > 0) {
        headerChallengesBadge.textContent = `${res.pendingCount} Pending 🔥`;
      } else {
        headerChallengesBadge.textContent = 'Challenges 🎯';
      }
    }

    if (challengesPendingCount) {
      challengesPendingCount.textContent = res.pendingCount || 0;
    }

    renderChallengesList(activeChallengeTab);
  } catch (err) {
    console.warn('Failed to load challenges:', err);
  }
}

function renderChallengesList(tab = 'incoming') {
  if (!challengesItemsContainer) return;

  if (tab === 'incoming') {
    const pending = challengesCache.pendingIncoming || [];
    const completed = challengesCache.completedIncoming || [];

    if (pending.length === 0 && completed.length === 0) {
      challengesItemsContainer.innerHTML = `
        <div style="text-align:center; padding: 2rem; color: var(--text-muted); font-size:0.9rem;">
          No incoming challenges right now. Challenge your friends to start a rivalry!
        </div>
      `;
      return;
    }

    let html = '';
    if (pending.length > 0) {
      html += `<div style="font-size:0.8rem; font-weight:800; color:#d97706; text-transform:uppercase; margin-bottom:0.5rem;">Pending Challenges (${pending.length})</div>`;
      html += pending.map(c => `
        <div class="challenge-card pending">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="cursor:pointer;" class="feed-user-link" data-username="${c.challenger_username}">${c.challenger_display_name}</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">(@${c.challenger_username})</span>
            </div>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">${formatRelativeTime(c.created_at)}</span>
          </div>
          <div style="font-size:0.88rem; color:var(--text-color);">
            Challenged you to beat <strong style="color:var(--accent); font-size:1.05rem;">${c.target_score} Pts</strong> on <strong style="text-transform:capitalize;">${c.game_id} (${c.difficulty})</strong>!
          </div>
          <div style="display:flex; gap:0.5rem; margin-top:0.35rem;">
            <button class="btn-challenge-play btn-play" data-id="${c.id}" style="padding:0.4rem 0.9rem; font-size:0.82rem; border-radius:8px;">⚔️ Play Now</button>
            <button class="btn-challenge-decline btn-lock" data-id="${c.id}" style="padding:0.4rem 0.8rem; font-size:0.82rem; border-radius:8px;">Decline</button>
          </div>
        </div>
      `).join('');
    }

    if (completed.length > 0) {
      html += `<div style="font-size:0.8rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-top:1rem; margin-bottom:0.5rem;">Completed Challenges</div>`;
      html += completed.map(c => {
        const isMeWinner = currentUser && c.winner_user_id === currentUser.id;
        return `
          <div class="challenge-card ${isMeWinner ? 'won' : 'lost'}">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong>${c.challenger_display_name}</strong> vs You
              </div>
              <span style="font-size:0.78rem; font-weight:800; color:${isMeWinner ? '#16a34a' : '#ef4444'};">
                ${isMeWinner ? '🏆 VICTORY' : 'DEFEAT'}
              </span>
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted);">
              Game: <strong style="text-transform:capitalize;">${c.game_id} (${c.difficulty})</strong> · Target: ${c.target_score} Pts · Your Score: ${c.opponent_score} Pts
            </div>
          </div>
        `;
      }).join('');
    }

    challengesItemsContainer.innerHTML = html;

    // Attach play and decline handlers
    challengesItemsContainer.querySelectorAll('.btn-challenge-play').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const chal = (challengesCache.pendingIncoming || []).find(c => c.id === id);
        if (chal) playChallenge(chal);
      });
    });

    challengesItemsContainer.querySelectorAll('.btn-challenge-decline').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        try {
          await api.respondChallenge({ challengeId: id, action: 'decline' });
          await loadChallenges();
        } catch (err) {
          alert(err.message || 'Failed to decline challenge');
        }
      });
    });

    challengesItemsContainer.querySelectorAll('.feed-user-link').forEach(link => {
      link.addEventListener('click', () => {
        challengesModal?.classList.add('hidden');
        openPublicProfile(link.dataset.username);
      });
    });
  } else {
    // Sent challenges
    const sent = challengesCache.sent || [];
    if (sent.length === 0) {
      challengesItemsContainer.innerHTML = `
        <div style="text-align:center; padding: 2rem; color: var(--text-muted); font-size:0.9rem;">
          You haven't challenged any friends yet. Visit a player's profile to issue a challenge!
        </div>
      `;
      return;
    }

    challengesItemsContainer.innerHTML = sent.map(c => {
      const isPending = c.status === 'pending';
      const isWon = currentUser && c.winner_user_id === currentUser.id;
      return `
        <div class="challenge-card ${isPending ? 'pending' : isWon ? 'won' : 'lost'}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              To: <strong>${c.opponent_display_name}</strong> (@${c.opponent_username})
            </div>
            <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">${formatRelativeTime(c.created_at)}</span>
          </div>
          <div style="font-size:0.85rem; color:var(--text-color);">
            Game: <strong style="text-transform:capitalize;">${c.game_id} (${c.difficulty})</strong> · Target Score: <strong style="color:var(--accent);">${c.target_score} Pts</strong>
          </div>
          <div style="font-size:0.78rem; font-weight:700;">
            ${isPending ? '⏳ Awaiting opponent response...' : isWon ? '🏆 You won this challenge! (+35 Coins & +50 XP)' : `Defeat (Opponent scored ${c.opponent_score} Pts)`}
          </div>
        </div>
      `;
    }).join('');
  }
}

function playChallenge(challenge) {
  activeChallenge = challenge;
  challengesModal?.classList.add('hidden');

  activeGameId = challenge.game_id;
  currentTier = challenge.difficulty;

  // Show active challenge banner
  if (activeChallengeBanner && activeChallengeText) {
    activeChallengeText.textContent = `⚔️ Head-to-Head Challenge from @${challenge.challenger_username}: Beat ${challenge.target_score} Pts!`;
    activeChallengeBanner.classList.remove('hidden');
  }

  // Switch to game view
  frontPageView.classList.add('hidden');
  gameView.classList.remove('hidden');

  // Update active tier tab
  tierTabs?.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tier === currentTier);
  });

  loadCurrentPuzzle();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

btnCancelChallengePlay?.addEventListener('click', () => {
  activeChallenge = null;
  activeChallengeBanner?.classList.add('hidden');
  showStatus('Challenge exited.', 'var(--text-muted)');
});

function openChallengesModal() {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }
  challengesModal?.classList.remove('hidden');
  loadChallenges();
}

btnOpenChallenges?.addEventListener('click', openChallengesModal);
challengesModalClose?.addEventListener('click', () => challengesModal?.classList.add('hidden'));
challengesModal?.addEventListener('click', (e) => {
  if (e.target === challengesModal) challengesModal?.classList.add('hidden');
});

challengesTabs?.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  challengesTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeChallengeTab = btn.dataset.tab;
  renderChallengesList(activeChallengeTab);
});

// Create Challenge Modal
function openCreateChallengeModal(opponentUsername, suggestedGameId = 'wordle') {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }

  if (challengeOpponentInput) challengeOpponentInput.value = opponentUsername;
  
  if (challengeGameSelect) {
    const games = getAllGames();
    challengeGameSelect.innerHTML = games.map(g => `
      <option value="${g.id}" ${g.id === suggestedGameId ? 'selected' : ''}>${g.title}</option>
    `).join('');
  }

  const userStat = userStats[suggestedGameId];
  if (challengeTargetScore) {
    challengeTargetScore.value = userStat?.best_score && userStat.best_score > 0 ? userStat.best_score : 650;
  }

  createChallengeModal?.classList.remove('hidden');
}

createChallengeModalClose?.addEventListener('click', () => createChallengeModal?.classList.add('hidden'));
createChallengeModal?.addEventListener('click', (e) => {
  if (e.target === createChallengeModal) createChallengeModal?.classList.add('hidden');
});

createChallengeForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const toUsername = challengeOpponentInput?.value?.trim();
  const gameId = challengeGameSelect?.value;
  const difficulty = challengeTierSelect?.value;
  const targetScore = parseInt(challengeTargetScore?.value, 10);

  if (!toUsername || !gameId || !difficulty || isNaN(targetScore)) return;

  const submitBtn = document.getElementById('btn-submit-challenge');
  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Challenge...';
    }

    const res = await api.createChallenge({
      toUsername,
      gameId,
      difficulty,
      targetScore,
    });

    createChallengeModal?.classList.add('hidden');
    alert(`🎉 ${res.message}`);
    await loadChallenges();
  } catch (err) {
    alert(err.message || 'Failed to send challenge');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Challenge 🎯';
    }
  }
});

btnChallengePublic?.addEventListener('click', () => {
  if (currentPublicUser) {
    publicProfileModal?.classList.add('hidden');
    openCreateChallengeModal(currentPublicUser.username);
  }
});



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
    stopPuzzleTimer();
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
    const prevWord = currentPuzzle?.targetWord;
    currentPuzzle = getPlaygroundPuzzle(activeGameId, prevWord);
    gameBadge.textContent = 'Playground Mode (Unranked · Unlimited)';
  } else {
    newGameBtn.textContent = '↺ Reset Puzzle';
    currentPuzzle = getDailyPuzzle(activeGameId, currentTier, dateStr);
    gameBadge.textContent = `Daily ${currentTier.toUpperCase()} (${dateStr})`;
  }

  startTime = Date.now();
  startPuzzleTimer();

  // Mount the active game dynamically via plug-and-play lifecycle
  const game = getGameConfig(activeGameId);
  if (typeof game.mount === 'function') {
    activeGameCleanup = game.mount(gameArenaContent, currentPuzzle, {
      onWin: (score, timeTakenMs, extraCtx) => handleGameWin(activeGameId, currentTier, score, timeTakenMs, extraCtx),
      showStatus: (msg, color) => showStatus(msg, color),
      setRules: (html) => { gameRulesBox.innerHTML = html; },
      onHint: async (gameId) => {
        const res = await api.useHint(gameId);
        currentUser.coins = res.remainingCoins;
        updateAuthUI();
        return res;
      }
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

async function handleGameWin(gameId, tier, earnedPoints, customTimeTakenMs, extraCtx = {}) {
  stopPuzzleTimer();
  const timeTakenMs = customTimeTakenMs || Math.max(1500, Date.now() - startTime);

  // Speed Bonus Scoring: <30s: +50, <60s: +25, <120s: +10
  let speedBonus = 0;
  if (timeTakenMs < 30000) speedBonus = 50;
  else if (timeTakenMs < 60000) speedBonus = 25;
  else if (timeTakenMs < 120000) speedBonus = 10;

  const totalPoints = earnedPoints + speedBonus;

  try {
    const res = await api.submitScore({
      gameId,
      difficulty: tier,
      score: totalPoints,
      timeTakenMs,
      wordleTries: extraCtx?.wordleTries,
      dateStr: getTodayDateStr(),
    });

    if (tier !== 'playground') {
      todayCompletions.add(`${gameId}:${tier}`);
      updateDailySweepUI();
    }

    if (res.stats) {
      userStats[gameId] = res.stats;
    } else {
      const currentStats = userStats[gameId] || { total_score: 0, plays_count: 0, best_score: 0, best_streak: 0 };
      userStats[gameId] = {
        ...currentStats,
        total_score: (currentStats.total_score || 0) + totalPoints,
        plays_count: (currentStats.plays_count || 0) + 1,
        best_score: Math.max(currentStats.best_score || 0, totalPoints),
      };
    }
    updateScoreDisplay();

    if (res.levelInfo) {
      if (currentUser) currentUser.xp = res.totalXp;
      updateLevelUI(res.levelInfo);
    }

    const speedBonusMsg = speedBonus > 0 ? ` (+${speedBonus} Speed Bonus ⚡)` : '';
    const xpBonusMsg = (res.xpAwarded && res.xpAwarded > 0) ? ` · +${res.xpAwarded} XP ⭐` : '';

    if (res.coinsAwarded > 0) {
      currentUser.coins = res.currentCoins;
      currentUser.streakCount = res.streakCount;
      updateAuthUI();

      const multiplier = res.streakMultiplier ?? 1;
      const streakBonus = multiplier > 1.0
        ? ` (🔥 ${multiplier.toFixed(1)}× Streak Bonus!)`
        : '';
      const sweepBonusMsg = res.isDailySweep ? ` 🏆 +${res.dailySweepBonusCoins || 50} DAILY SWEEP BONUS!` : '';
      showStatus(`🎉 Solved! +${totalPoints} Pts${speedBonusMsg}${xpBonusMsg} & +${res.coinsAwarded} Coins${streakBonus}${sweepBonusMsg}`, "var(--correct-bg)");
    } else {
      showStatus(`🎉 Solved! +${totalPoints} Pts${speedBonusMsg}${xpBonusMsg} recorded!`, "var(--correct-bg)");
    }

    // Resolve active PvP Challenge if playing in challenge mode
    if (activeChallenge) {
      try {
        const chalRes = await api.respondChallenge({
          challengeId: activeChallenge.id,
          action: 'complete',
          score: totalPoints,
          timeTakenMs,
        });
        showStatus(chalRes.message, chalRes.isWinner ? 'var(--correct-bg)' : 'var(--accent)');
        activeChallenge = null;
        activeChallengeBanner?.classList.add('hidden');
        await loadChallenges();
        await loadActivityFeed();
      } catch (chalErr) {
        console.warn('Challenge submit error:', chalErr);
      }
    }

    // Newly unlocked badges celebration
    if (res.newBadgesUnlocked && res.newBadgesUnlocked.length > 0) {
      setTimeout(() => {
        showBadgeUnlockCelebration(res.newBadgesUnlocked);
      }, 700);
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
      updateDailySweepUI();
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

// Rules Modal Trigger
btnOpenRules?.addEventListener('click', () => {
  rulesModalContent.innerHTML = gameRulesBox.innerHTML || '<p>Solve the puzzle according to standard rules.</p>';
  rulesModal.classList.remove('hidden');
});
rulesModalClose?.addEventListener('click', () => rulesModal.classList.add('hidden'));
rulesModal?.addEventListener('click', (e) => {
  if (e.target === rulesModal) rulesModal.classList.add('hidden');
});

// =========================================================================
// 5. LIVE LEADERBOARDS (Global, Friends, Daily)
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
  const isGlobal = btnGlobalTab.classList.contains('active');
  const isFriends = btnFriendsTab?.classList.contains('active');
  const isTournament = btnTournamentTab?.classList.contains('active');

  if (isTournament) {
    const rows = data.weeklyTournament || [];
    if (!rows.length) {
      view.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No tournament points scored yet this week (${data.currentWeekId || 'Current Week'}). Solve puzzles to rank!</p>`;
      return;
    }
    view.innerHTML = `
      <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom: 0.5rem; font-weight:700;">
        ⚔️ Active Tournament: ${data.currentWeekId || 'Weekly Season'} · Resets every Sunday midnight UTC
      </div>
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th style="width: 14%;">Rank</th>
            <th>Player</th>
            <th style="text-align: right;">Points</th>
            <th style="text-align: right;">Games Played</th>
            <th style="text-align: right;">Level</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => {
            const isMe = currentUser && (r.user_id === currentUser.id || r.username === currentUser.username);
            const rankLabel = i === 0 ? '🥇 #1' : i === 1 ? '🥈 #2' : i === 2 ? '🥉 #3' : `#${i + 1}`;
            const youTag = isMe ? `<span class="you-badge">You</span>` : '';
            const titlePill = r.selected_title ? `<span class="player-custom-title" style="font-size:0.68rem; margin-left:4px;">${formatTitleName(r.selected_title)}</span>` : '';
            const lvl = calculateClientLevel(r.xp || 0).level;
            return `
              <tr class="${isMe ? 'leaderboard-row-me' : ''}">
                <td><strong>${rankLabel}</strong></td>
                <td>
                  <strong style="cursor: pointer;" class="leaderboard-player-link" data-username="${r.username}">
                    ${r.display_name || r.username}
                  </strong>
                  ${titlePill}
                  ${youTag}
                </td>
                <td style="text-align: right;"><strong style="color:var(--accent); font-size:1.05rem;">${r.points}</strong></td>
                <td style="text-align: right; font-weight: 700; color: var(--text-muted);">${r.games_played}</td>
                <td style="text-align: right;"><span class="badge" style="padding:2px 7px; font-size:0.75rem;">Lvl ${lvl}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>`;

    view.querySelectorAll('.leaderboard-player-link').forEach(el => {
      el.addEventListener('click', () => {
        openPublicProfile(el.dataset.username);
      });
    });
    return;
  }

  if (isGlobal || isFriends) {
    const rows = (isFriends ? data.friendsLeaderboard : data.globalLeaderboard) || [];
    if (!rows.length) {
      view.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">${
        isFriends
          ? 'No friends ranked yet. Add friends from your profile to compare scores!'
          : 'No players ranked yet for this game. Be the first to play and claim #1!'
      }</p>`;
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
            const titlePill = r.selected_title ? `<span class="player-custom-title" style="font-size:0.68rem; margin-left:4px;">${formatTitleName(r.selected_title)}</span>` : '';
            return `
              <tr class="${isMe ? 'leaderboard-row-me' : ''}">
                <td><strong>${rankLabel}</strong></td>
                <td>
                  <strong style="cursor: pointer;" class="leaderboard-player-link" data-username="${r.username}">
                    ${r.display_name || r.username}
                  </strong>
                  ${titlePill}
                  ${youTag}
                </td>
                <td style="text-align: right;"><strong style="color:var(--accent); font-size:1.05rem;">${r.global_average_score}</strong></td>
                <td style="text-align: right; font-weight: 700; color: var(--text-muted);">${r.plays_count}</td>
                <td style="text-align: right;">${r.best_score}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>`;

    view.querySelectorAll('.leaderboard-player-link').forEach(el => {
      el.addEventListener('click', () => {
        openPublicProfile(el.dataset.username);
      });
    });
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
            const titlePill = r.selected_title ? `<span class="player-custom-title" style="font-size:0.68rem; margin-left:4px;">${formatTitleName(r.selected_title)}</span>` : '';
            return `
              <tr class="${isMe ? 'leaderboard-row-me' : ''}">
                <td><strong>${rankLabel}</strong></td>
                <td>
                  <strong style="cursor: pointer;" class="leaderboard-player-link" data-username="${r.username}">
                    ${r.display_name || r.username}
                  </strong>
                  ${titlePill}
                  ${youTag}
                </td>
                <td><span style="text-transform:capitalize; padding: 2px 8px; border-radius:6px; background:#f1f5f9; font-weight:700; font-size:0.8rem;">${r.difficulty}</span></td>
                <td style="text-align: right;"><strong style="color:var(--correct-bg); font-size:1.05rem;">${r.score}</strong></td>
                <td style="text-align: right;">${(r.time_taken_ms / 1000).toFixed(1)}s</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>`;

    view.querySelectorAll('.leaderboard-player-link').forEach(el => {
      el.addEventListener('click', () => {
        openPublicProfile(el.dataset.username);
      });
    });
  }
}

btnGlobalTab?.addEventListener('click', (e) => {
  e.target.classList.add('active');
  btnFriendsTab?.classList.remove('active');
  btnDailyTab?.classList.remove('active');
  btnTournamentTab?.classList.remove('active');
  loadLeaderboard();
});

btnFriendsTab?.addEventListener('click', (e) => {
  e.target.classList.add('active');
  btnGlobalTab?.classList.remove('active');
  btnDailyTab?.classList.remove('active');
  btnTournamentTab?.classList.remove('active');
  loadLeaderboard();
});

btnDailyTab?.addEventListener('click', (e) => {
  e.target.classList.add('active');
  btnGlobalTab?.classList.remove('active');
  btnFriendsTab?.classList.remove('active');
  btnTournamentTab?.classList.remove('active');
  loadLeaderboard();
});

btnTournamentTab?.addEventListener('click', (e) => {
  e.target.classList.add('active');
  btnGlobalTab?.classList.remove('active');
  btnFriendsTab?.classList.remove('active');
  btnDailyTab?.classList.remove('active');
  loadLeaderboard();
});

// =========================================================================
// 6. PROFILE, BEST STREAKS, AND FRIENDS SYSTEM
// =========================================================================

async function loadFriendsList() {
  if (!currentUser) return;
  try {
    const res = await api.getFriends();
    currentFriendsCache = res.friends || [];
    renderFriendsList(currentFriendsCache);
  } catch (err) {
    console.warn('Failed to load friends:', err);
  }
}

function renderFriendsList(friends) {
  if (!profileFriendsList) return;
  if (!friends || friends.length === 0) {
    profileFriendsList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.82rem; text-align: center; padding: 0.5rem;">No friends added yet. Enter a username above to add your friends!</p>';
    return;
  }

  profileFriendsList.innerHTML = friends.map(f => `
    <div class="friend-item">
      <span class="friend-name" data-username="${f.username}">
        ${f.display_name || f.username} <span style="font-weight:normal; color:var(--text-muted); font-size:0.75rem;">(@${f.username})</span>
      </span>
      <div style="display:flex; gap:0.35rem; align-items:center;">
        <button class="btn-challenge-friend btn-lock" data-username="${f.username}" title="Challenge to head-to-head" style="color:var(--accent); border-color:var(--accent); font-size:0.75rem; padding:0.2rem 0.5rem;">🎯 Challenge</button>
        <button class="btn-remove-friend" data-id="${f.friend_id}" title="Remove friend">&times; Remove</button>
      </div>
    </div>
  `).join('');

  profileFriendsList.querySelectorAll('.friend-name').forEach(el => {
    el.addEventListener('click', () => {
      openPublicProfile(el.dataset.username);
    });
  });

  profileFriendsList.querySelectorAll('.btn-challenge-friend').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      profileModal.classList.add('hidden');
      openCreateChallengeModal(el.dataset.username);
    });
  });

  profileFriendsList.querySelectorAll('.btn-remove-friend').forEach(el => {
    el.addEventListener('click', async (e) => {
      e.stopPropagation();
      const friendId = el.dataset.id;
      try {
        await api.removeFriend(friendId);
        await loadFriendsList();
      } catch (err) {
        alert(err.message || 'Failed to remove friend');
      }
    });
  });
}

function openProfileModal() {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }

  profileDisplayName.textContent = currentUser.displayName || currentUser.username;
  profileUsername.textContent = `@${currentUser.username}`;
  profileAboutInput.value = currentUser.about || '';
  profileFriendsFeedback.style.display = 'none';

  // Apply equipped frame, title, and level
  applyEquippedCosmetics();
  updateLevelUI();

  // Render 30-day activity heatmap
  if (profileHeatmap) {
    const activityMap = {};
    (currentUser.activityHistory || []).forEach(r => {
      activityMap[r.played_date] = r.completions_count;
    });
    renderCalendarHeatmap(profileHeatmap, activityMap);
  }

  // Render best streaks maintained per game
  const games = getAllGames();
  profileStreaksGrid.innerHTML = games.map(g => {
    const stats = userStats[g.id] || {};
    const bestStreak = stats.best_streak ?? stats.current_streak ?? 0;
    return `
      <div class="streak-card">
        <div class="game-label">${g.title}</div>
        <div class="streak-val">🔥 ${bestStreak}</div>
      </div>
    `;
  }).join('');

  // Render player's badges
  const profileBadgesGrid = document.getElementById('profile-badges-grid');
  renderBadgesGrid(profileBadgesGrid, userBadges);

  loadFriendsList();
  profileModal.classList.remove('hidden');
}

btnOpenProfile?.addEventListener('click', openProfileModal);
profileModalClose?.addEventListener('click', () => profileModal.classList.add('hidden'));
profileModal?.addEventListener('click', (e) => {
  if (e.target === profileModal) profileModal.classList.add('hidden');
});

// Save About Description
btnSaveProfile?.addEventListener('click', async () => {
  const about = profileAboutInput.value.trim();
  try {
    btnSaveProfile.disabled = true;
    btnSaveProfile.textContent = 'Saving...';
    const res = await api.updateProfile(currentUser.displayName, about);
    currentUser.about = res.user.about;
    currentUser.displayName = res.user.display_name;
    api.setSession(api.token, currentUser);
    btnSaveProfile.textContent = 'Saved ✓';
    setTimeout(() => {
      btnSaveProfile.textContent = 'Save About';
      btnSaveProfile.disabled = false;
    }, 1500);
  } catch (err) {
    alert(err.message || 'Failed to update profile');
    btnSaveProfile.disabled = false;
    btnSaveProfile.textContent = 'Save About';
  }
});

// Add Friend inside profile
btnAddFriend?.addEventListener('click', async () => {
  const friendUsername = addFriendInput.value.trim();
  if (!friendUsername) return;
  try {
    btnAddFriend.disabled = true;
    const res = await api.addFriend(friendUsername);
    addFriendInput.value = '';
    profileFriendsFeedback.textContent = `✓ Added @${friendUsername} as a friend!`;
    profileFriendsFeedback.style.color = 'var(--correct-bg)';
    profileFriendsFeedback.style.display = 'block';
    await loadFriendsList();

    if (res.newBadgesUnlocked && res.newBadgesUnlocked.length > 0) {
      showBadgeUnlockCelebration(res.newBadgesUnlocked);
      const profileBadgesGrid = document.getElementById('profile-badges-grid');
      renderBadgesGrid(profileBadgesGrid, userBadges);
    }
  } catch (err) {
    profileFriendsFeedback.textContent = `⚠️ ${err.message}`;
    profileFriendsFeedback.style.color = 'var(--danger)';
    profileFriendsFeedback.style.display = 'block';
  } finally {
    btnAddFriend.disabled = false;
  }
});

// Public Player Profile (Shows only Gamertag & Description)
async function openPublicProfile(username) {
  try {
    const res = await api.getUserProfile(username);
    currentPublicUser = res.profile;

    publicProfileGamertag.textContent = currentPublicUser.display_name || currentPublicUser.username;
    publicProfileHandle.textContent = `@${currentPublicUser.username}`;
    publicProfileAbout.textContent = currentPublicUser.about || 'No description provided yet.';

    // Avatar frame
    applyCosmeticToAvatar(publicProfileAvatar, currentPublicUser.selectedFrame);

    // Player title
    if (publicProfileCustomTitle) {
      if (currentPublicUser.selectedTitle) {
        publicProfileCustomTitle.textContent = formatTitleName(currentPublicUser.selectedTitle);
        publicProfileCustomTitle.classList.remove('hidden');
      } else {
        publicProfileCustomTitle.classList.add('hidden');
      }
    }

    // Player level
    if (publicProfileLevel) {
      publicProfileLevel.textContent = `Lvl ${currentPublicUser.level || 1} · ${currentPublicUser.levelTitle || 'Novice'}`;
    }

    // 30-Day Activity Heatmap
    if (publicProfileHeatmap) {
      renderCalendarHeatmap(publicProfileHeatmap, currentPublicUser.activityHistory || {});
    }

    const isFriend = currentFriendsCache.some(f => f.username === currentPublicUser.username);
    const isSelf = currentUser && currentUser.username === currentPublicUser.username;

    if (isSelf) {
      btnToggleFriendPublic.style.display = 'none';
    } else {
      btnToggleFriendPublic.style.display = 'block';
      if (isFriend) {
        btnToggleFriendPublic.textContent = 'Remove Friend';
        btnToggleFriendPublic.className = 'btn-lock';
        btnToggleFriendPublic.style.width = '100%';
      } else {
        btnToggleFriendPublic.textContent = 'Add Friend';
        btnToggleFriendPublic.className = 'btn-login';
        btnToggleFriendPublic.style.width = '100%';
      }
    }

    // Populate their best streaks in each game
    const publicStreaksGrid = document.getElementById('public-profile-streaks-grid');
    if (publicStreaksGrid) {
      const allGames = getAllGames();
      const userStreaks = currentPublicUser.streaks || [];
      const streakMap = new Map();
      userStreaks.forEach(s => streakMap.set(s.game_id, s.best_streak ?? 0));

      publicStreaksGrid.innerHTML = allGames.map(g => {
        const best = streakMap.get(g.id) || 0;
        return `
          <div class="streak-card">
            <div class="game-label">${g.title}</div>
            <div class="streak-val">🔥 ${best}</div>
          </div>
        `;
      }).join('');
    }

    // Populate their unlocked badges
    const publicBadgesGrid = document.getElementById('public-profile-badges-grid');
    if (publicBadgesGrid) {
      renderBadgesGrid(publicBadgesGrid, currentPublicUser.badges || []);
    }

    publicProfileModal.classList.remove('hidden');
  } catch (err) {
    alert(err.message || 'Could not find player');
  }
}

publicProfileClose?.addEventListener('click', () => publicProfileModal.classList.add('hidden'));
publicProfileModal?.addEventListener('click', (e) => {
  if (e.target === publicProfileModal) publicProfileModal.classList.add('hidden');
});

btnToggleFriendPublic?.addEventListener('click', async () => {
  if (!currentPublicUser) return;
  const isFriend = currentFriendsCache.some(f => f.username === currentPublicUser.username);
  try {
    if (isFriend) {
      const match = currentFriendsCache.find(f => f.username === currentPublicUser.username);
      if (match) await api.removeFriend(match.friend_id);
    } else {
      await api.addFriend(currentPublicUser.username);
    }
    await loadFriendsList();
    openPublicProfile(currentPublicUser.username);
  } catch (err) {
    alert(err.message || 'Action failed');
  }
});

// Player Search in Header beside Logo
let playerSearchTimeout = null;
playerSearchInput?.addEventListener('input', () => {
  const q = playerSearchInput.value.trim();
  clearTimeout(playerSearchTimeout);

  if (!q || q.length < 2) {
    playerSearchDropdown.innerHTML = '';
    playerSearchDropdown.classList.add('hidden');
    return;
  }

  playerSearchTimeout = setTimeout(async () => {
    try {
      const res = await api.searchUsers(q);
      const users = res.users || [];
      if (users.length === 0) {
        playerSearchDropdown.innerHTML = '<div style="padding:0.75rem; font-size:0.8rem; color:var(--text-muted); text-align:center;">No players found</div>';
      } else {
        playerSearchDropdown.innerHTML = users.map(u => `
          <div class="player-search-item" data-username="${u.username}">
            <span class="player-name">${u.display_name || u.username}</span>
            <span class="player-handle">@${u.username}</span>
          </div>
        `).join('');

        playerSearchDropdown.querySelectorAll('.player-search-item').forEach(item => {
          item.addEventListener('click', () => {
            const username = item.dataset.username;
            playerSearchDropdown.classList.add('hidden');
            playerSearchInput.value = '';
            openPublicProfile(username);
          });
        });
      }
      playerSearchDropdown.classList.remove('hidden');
    } catch (err) {
      console.warn('Player search error:', err);
    }
  }, 250);
});

// Hide dropdown on click outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.player-search-wrapper')) {
    playerSearchDropdown?.classList.add('hidden');
  }
});

// =========================================================================
// 7. ANDROID HOME SCREEN (PWA INSTALL) SYSTEM
// =========================================================================
let deferredInstallPrompt = null;
const btnAddToHome = document.getElementById('btn-add-to-home');
const pwaInstallMsg = document.getElementById('pwa-install-msg');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  if (pwaInstallMsg) {
    pwaInstallMsg.textContent = '🎉 Gamify was added to your home screen!';
    pwaInstallMsg.style.display = 'block';
    pwaInstallMsg.style.background = '#dcfce7';
    pwaInstallMsg.style.color = '#15803d';
  }
});

btnAddToHome?.addEventListener('click', async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      if (pwaInstallMsg) {
        pwaInstallMsg.textContent = '🎉 Adding Gamify icon to your home screen...';
        pwaInstallMsg.style.display = 'block';
        pwaInstallMsg.style.background = '#dcfce7';
        pwaInstallMsg.style.color = '#15803d';
      }
    }
    deferredInstallPrompt = null;
  } else {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      if (pwaInstallMsg) {
        pwaInstallMsg.textContent = '✅ Gamify is already installed on your home screen!';
        pwaInstallMsg.style.display = 'block';
        pwaInstallMsg.style.background = '#dcfce7';
        pwaInstallMsg.style.color = '#15803d';
      }
    } else {
      if (pwaInstallMsg) {
        pwaInstallMsg.innerHTML = '📲 <strong>To install on Android:</strong> Tap your browser menu (<strong>⋮</strong> three dots at the top-right) and select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.';
        pwaInstallMsg.style.display = 'block';
        pwaInstallMsg.style.background = '#e0f2fe';
        pwaInstallMsg.style.color = '#0369a1';
      }
    }
  }
});

// Register Service Worker for PWA compliance & offline caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('ServiceWorker registration note:', err);
    });
  });
}

// =========================================================================
// 8. INITIAL BOOTSTRAP
// =========================================================================

async function bootstrap() {
  setupPinInputs();
  updateAuthUI();
  await fetchUserProfile();
  updateDailySweepUI();
  renderGamesScrollList();
  loadChallenges();
  loadActivityFeed();
}

bootstrap();
