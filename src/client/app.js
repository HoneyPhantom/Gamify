/**
 * Gamify Main Frontend Application
 * High-performance, offline-first PWA client with modular games,
 * instant optimistic UI updates, Canvas confetti, and social features.
 */

import { getAllGames, loadGameConfig, getGameConfig, getDailyPuzzle, getPlaygroundPuzzle, getTodayDateStr } from '../games/index.js';
import { api } from './api.js';
import { launchConfetti } from './confetti.js';
import { idbGet, idbSet } from './idb.js';

// =========================================================================
// APPLICATION STATE
// =========================================================================
let currentUser = api.getCachedUser();
let userUnlocks = {}; // Map of gameId -> unlock record
let userStats = {}; // Map of gameId -> user_game_stats record
let todayCompletions = new Set(); // Set of "gameId:difficulty" completed today

let userFollowing = [];
let userFollowers = [];
let userFollowingCount = 0;
let userFollowersCount = 0;

let activeGameId = 'wordle';
let currentTier = 'easy';
let currentPuzzle = null;
let startTime = Date.now();
let activeGameCleanup = null; // Cleanup function for currently mounted game
let gameTimerInterval = null;

let activeChallenge = null;
let activeChallengeTab = 'incoming';
let challengesCache = { incoming: [], sent: [], pendingIncoming: [], completedIncoming: [] };
let currentPublicUser = null;

let shopCatalog = [];
let shopOwned = new Set();
let activeShopTab = 'frame';

let isInfinitePlay = false;

const DIFFICULTY_TIERS = [
  { tier: 'easy', label: 'EASY', avatar: '😊', color: '#10b981', fillWidth: '20%' },
  { tier: 'medium', label: 'MEDIUM', avatar: '😼', color: '#f59e0b', fillWidth: '55%' },
  { tier: 'hard', label: 'HARD', avatar: '😈', color: '#ef4444', fillWidth: '95%' },
];

// =========================================================================
// DOM ELEMENTS
// =========================================================================
const frontPageView = document.getElementById('front-page-view');
const gameView = document.getElementById('game-view');
const gamesScrollList = document.getElementById('games-scroll-list');
const brandLogo = document.getElementById('brand-logo');

// Navigation & Auth DOM Elements
const authStateLoggedIn = document.getElementById('auth-state-logged-in');
const authStateLoggedOut = document.getElementById('auth-state-logged-out');
const coinBalanceEl = document.getElementById('coin-balance');
const streakCountEl = document.getElementById('streak-count');
const navUserNameEl = document.getElementById('nav-user-name');
const btnOpenAuth = document.getElementById('btn-open-auth');
const btnLogout = document.getElementById('btn-logout');
const headerUserLevel = document.getElementById('header-user-level');
const headerXpBadge = document.getElementById('header-xp-badge');

// Profile Inner Actions
const btnProfileLogout = document.getElementById('btn-profile-logout');
const btnProfileChallenges = document.getElementById('btn-profile-challenges');
const btnProfileShop = document.getElementById('btn-profile-shop');
const btnProfileInstallApp = document.getElementById('btn-profile-install-app');
const profileStreakCount = document.getElementById('profile-streak-count');

// World Wars Elements
const btnOpenWorldWars = document.getElementById('btn-open-world-wars');
const worldWarsModal = document.getElementById('world-wars-modal');
const worldWarsModalClose = document.getElementById('world-wars-modal-close');
const btnWwTabGlobal = document.getElementById('btn-ww-tab-global');
const btnWwTabTournaments = document.getElementById('btn-ww-tab-tournaments');
const worldWarsGameFilter = document.getElementById('world-wars-game-filter');
const wwPodiumContainer = document.getElementById('ww-podium-container');
const wwRankedList = document.getElementById('ww-ranked-list');
const wwCurrentTournamentBanner = document.getElementById('ww-current-tournament-banner');
const wwContestsList = document.getElementById('ww-contests-list');
const worldWarsMyRank = document.getElementById('world-wars-my-rank');
const worldWarsWeekLabel = document.getElementById('world-wars-week-label');

// Install App Buttons
const btnNavInstallApp = document.getElementById('btn-nav-install-app');
const btnNavInstallAppLoggedOut = document.getElementById('btn-nav-install-app-loggedout');
const btnAddToHome = document.getElementById('btn-add-to-home');
const pwaInstallMsg = document.getElementById('pwa-install-msg');

// Daily Sweep Challenge Elements
const sweepStatusDesc = document.getElementById('sweep-status-desc');
const sweepStatusWordle = document.getElementById('sweep-status-wordle');
const sweepStatusNumberGrid = document.getElementById('sweep-status-number-grid');
const sweepStatusNumberTrail = document.getElementById('sweep-status-number-trail');
const sweepItemWordle = document.getElementById('sweep-item-wordle');
const sweepItemNumberGrid = document.getElementById('sweep-item-number-grid');
const sweepItemNumberTrail = document.getElementById('sweep-item-number-trail');

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

// Followers & Following Elements
const profileFollowersCount = document.getElementById('profile-followers-count');
const profileFollowingCount = document.getElementById('profile-following-count');
const tabBtnFollowing = document.getElementById('tab-btn-following');
const tabBtnFollowers = document.getElementById('tab-btn-followers');
const tabFollowingCount = document.getElementById('tab-following-count');
const tabFollowersCount = document.getElementById('tab-followers-count');
const profileFollowingList = document.getElementById('profile-following-list');
const profileFollowersList = document.getElementById('profile-followers-list');
const addFriendInput = document.getElementById('add-friend-input');
const btnAddFriend = document.getElementById('btn-add-friend');
const profileFriendsFeedback = document.getElementById('profile-friends-feedback');

// Public Profile Modal Elements
const publicProfileModal = document.getElementById('public-profile-modal');
const publicProfileClose = document.getElementById('public-profile-close');
const publicProfileGamertag = document.getElementById('public-profile-gamertag');
const publicProfileHandle = document.getElementById('public-profile-handle');
const publicProfileAbout = document.getElementById('public-profile-about');
const publicProfileAvatar = document.getElementById('public-profile-avatar');
const publicProfileCustomTitle = document.getElementById('public-profile-custom-title');
const publicProfileLevel = document.getElementById('public-profile-level');
const publicProfileFollowersCount = document.getElementById('public-profile-followers-count');
const publicProfileFollowingCount = document.getElementById('public-profile-following-count');
const btnToggleFriendPublic = document.getElementById('btn-toggle-friend-public');
const btnChallengePublic = document.getElementById('btn-challenge-public');

// Image 2 Launcher Screen Elements
const gameLauncherScreen = document.getElementById('game-launcher-screen');
const btnLauncherBack = document.getElementById('btn-launcher-back');
const launcherGameTitle = document.getElementById('launcher-game-title');
const launcherGameDesc = document.getElementById('launcher-game-desc');
const btnLauncherHelpTop = document.getElementById('btn-launcher-help-top');
const launcherDiffAvatar = document.getElementById('launcher-diff-avatar');
const launcherDiffTitle = document.getElementById('launcher-diff-title');
const launcherSliderTrack = document.getElementById('launcher-slider-track');
const launcherSliderFill = document.getElementById('launcher-slider-fill');
const launcherSliderKnob = document.getElementById('launcher-slider-knob');
const launcherBtnPlay = document.getElementById('launcher-btn-play');
const launcherBtnHelp = document.getElementById('launcher-btn-help');

// Game Arena Screen Elements
const gameArenaScreen = document.getElementById('game-arena-screen');
const btnBackToModes = document.getElementById('btn-back-to-modes');
const activeGameContainer = document.getElementById('active-game-container');
const gameArenaContent = document.getElementById('game-arena-content');
const gameBadge = document.getElementById('game-badge');
const gameTimerEl = document.getElementById('game-timer');
const speedBonusEl = document.getElementById('speed-bonus-indicator');
const statusEl = document.getElementById('status');
const totalScoreEl = document.getElementById('total-score');
const gamesWonEl = document.getElementById('games-won');
const newGameBtn = document.getElementById('new-game-btn');
const btnOpenRules = document.getElementById('btn-open-rules');
const gameRulesBox = document.getElementById('game-rules-box');

// Locked Tier Banner
const lockedTierContainer = document.getElementById('locked-tier-container');
const lockedBannerTitle = document.getElementById('locked-banner-title');
const lockedBannerDesc = document.getElementById('locked-banner-desc');
const unlockActionBtn = document.getElementById('unlock-action-btn');

// Image 3 Help Dialog Modal Elements
const helpDialogModal = document.getElementById('help-dialog-modal');
const helpDialogTitle = document.getElementById('help-dialog-title');
const helpDialogBody = document.getElementById('help-dialog-body');
const helpDialogIcon = document.getElementById('help-dialog-icon');
const btnHelpDialogOk = document.getElementById('btn-help-dialog-ok');

// Solved Victory Modal Elements (Clean score + confetti)
const solveVictoryModal = document.getElementById('solve-victory-modal');
const solveVictoryScore = document.getElementById('solve-victory-score');
const solveVictoryCoins = document.getElementById('solve-victory-coins');
const btnSolveVictoryOk = document.getElementById('btn-solve-victory-ok');

// Auth Modal Elements
const authModal = document.getElementById('auth-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const tabLoginBtn = document.getElementById('tab-login-btn');
const tabRegisterBtn = document.getElementById('tab-register-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authFeedback = document.getElementById('auth-feedback');
const loginUsernameInput = document.getElementById('login-username');

// Cosmetic Shop DOM Elements
const btnOpenShop = document.getElementById('btn-open-shop');
const shopModal = document.getElementById('shop-modal');
const shopModalClose = document.getElementById('shop-modal-close');
const shopCoinBalance = document.getElementById('shop-coin-balance');
const shopTabs = document.getElementById('shop-tabs');
const shopItemsContainer = document.getElementById('shop-items-container');

// Profile Customization DOM Elements
const profileAvatar = document.getElementById('profile-avatar');
const profileCustomTitle = document.getElementById('profile-custom-title');
const profileUserLevel = document.getElementById('profile-user-level');
const profileLevelTitle = document.getElementById('profile-level-title');
const profileXpFill = document.getElementById('profile-xp-fill');
const profileXpText = document.getElementById('profile-xp-text');

// Challenges Modal DOM Elements
const btnOpenUpdates = document.getElementById('btn-open-updates');
const headerUpdatesBadge = document.getElementById('header-updates-badge');
const updatesModal = document.getElementById('updates-modal');
const updatesModalClose = document.getElementById('updates-modal-close');
const challengesTabs = document.getElementById('challenges-tabs');
const challengesItemsContainer = document.getElementById('challenges-items-container');
const challengesIncomingSubcount = document.getElementById('challenges-incoming-subcount');

const createChallengeModal = document.getElementById('create-challenge-modal');
const createChallengeModalClose = document.getElementById('create-challenge-modal-close');
const createChallengeForm = document.getElementById('create-challenge-form');
const challengeOpponentInput = document.getElementById('challenge-opponent-input');
const challengeGameSelect = document.getElementById('challenge-game-select');
const challengeTierSelect = document.getElementById('challenge-tier-select');
const challengeTargetScore = document.getElementById('challenge-target-score');

const activeChallengeBanner = document.getElementById('active-challenge-banner');
const activeChallengeText = document.getElementById('active-challenge-text');
const btnCancelChallengePlay = document.getElementById('btn-cancel-challenge-play');

// Leaderboard Tabs
const btnGlobalTab = document.getElementById('btn-global-tab');
const btnFriendsTab = document.getElementById('btn-friends-tab');
const btnDailyTab = document.getElementById('btn-daily-tab');
const btnTournamentTab = document.getElementById('btn-tournament-tab');

// =========================================================================
// 1. PIN CREDENTIAL AUTHENTICATION
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
      slot.addEventListener('input', () => {
        const val = slot.value.replace(/\D/g, '');
        slot.value = val ? val[val.length - 1] : '';
        syncValue();
        if (slot.value && idx < slots.length - 1) {
          slots[idx + 1].focus();
        }
      });

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
    if (coinBalanceEl) coinBalanceEl.textContent = currentUser.coins ?? 100;
    if (streakCountEl) streakCountEl.textContent = currentUser.streakCount ?? 0;
    if (profileStreakCount) profileStreakCount.textContent = currentUser.streakCount ?? 0;
    if (navUserNameEl) navUserNameEl.textContent = currentUser.displayName || currentUser.username;
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

api.onSessionExpired = (username) => {
  currentUser = null;
  updateAuthUI();
  renderGamesScrollList();
  openAuthModal('login', username || '', '🔒 Enter your 4-digit PIN to continue your streaks and coin progress.');
};

tabLoginBtn.addEventListener('click', () => openAuthModal('login'));
tabRegisterBtn.addEventListener('click', () => openAuthModal('register'));
btnOpenAuth.addEventListener('click', () => openAuthModal('login'));
modalCloseBtn.addEventListener('click', closeAuthModal);

document.getElementById('switch-to-register')?.addEventListener('click', () => openAuthModal('register'));
document.getElementById('switch-to-login')?.addEventListener('click', () => openAuthModal('login'));

authModal.addEventListener('click', (e) => {
  if (e.target === authModal) closeAuthModal();
});

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

function handleUserLogout() {
  api.logout();
  currentUser = null;
  userUnlocks = {};
  userStats = {};
  todayCompletions = new Set();
  userFollowing = [];
  userFollowers = [];
  profileModal?.classList.add('hidden');
  updateAuthUI();
  updateScoreDisplay();
  renderGamesScrollList();
  returnToHome();
}

btnLogout?.addEventListener('click', handleUserLogout);
btnProfileLogout?.addEventListener('click', handleUserLogout);

btnProfileChallenges?.addEventListener('click', () => {
  profileModal?.classList.add('hidden');
  btnOpenUpdates?.click();
});

btnProfileShop?.addEventListener('click', () => {
  profileModal?.classList.add('hidden');
  btnOpenShop?.click();
});

// =========================================================================
// 2. BATCHED PROFILE & OFFLINE-FIRST STATE (INDEXEDDB)
// =========================================================================

async function restoreOfflineState() {
  try {
    const [cachedUser, cachedUnlocks, cachedStats, cachedCompletions, cachedFollowing] = await Promise.all([
      idbGet('gamify_user'),
      idbGet('gamify_unlocks'),
      idbGet('gamify_stats'),
      idbGet('gamify_completions'),
      idbGet('gamify_following'),
    ]);

    if (cachedUser && !currentUser) currentUser = cachedUser;
    if (cachedUnlocks) userUnlocks = cachedUnlocks;
    if (cachedStats) userStats = cachedStats;
    if (cachedCompletions) todayCompletions = new Set(cachedCompletions);
    if (cachedFollowing) {
      userFollowing = cachedFollowing;
      userFollowingCount = cachedFollowing.length;
    }

    updateAuthUI();
    updateScoreDisplay();
    updateDailySweepUI();
    renderGamesScrollList();
  } catch (err) {
    console.warn('Offline state restore note:', err);
  }
}

// Single Consolidated Batch API Request on App Load
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

    userFollowing = res.following || [];
    userFollowingCount = res.followingCount ?? userFollowing.length;
    userFollowersCount = res.followersCount ?? 0;

    if (res.pendingChallengesCount !== undefined && headerUpdatesBadge) {
      headerUpdatesBadge.textContent = res.pendingChallengesCount > 0 ? `Challenges (${res.pendingChallengesCount}) 🔥` : 'Challenges 🎯';
      if (challengesIncomingSubcount) challengesIncomingSubcount.textContent = res.pendingChallengesCount;
    }

    updateAuthUI();
    updateScoreDisplay();
    updateDailySweepUI();
    if (res.levelInfo) {
      updateLevelUI(res.levelInfo);
    } else {
      updateLevelUI();
    }
    applyEquippedCosmetics();

    // Cache to IndexedDB for 0ms load next session
    idbSet('gamify_user', currentUser).catch(() => {});
    idbSet('gamify_unlocks', userUnlocks).catch(() => {});
    idbSet('gamify_stats', userStats).catch(() => {});
    idbSet('gamify_completions', Array.from(todayCompletions)).catch(() => {});
    idbSet('gamify_following', userFollowing).catch(() => {});
  } catch (e) {
    console.warn('Profile fetch note:', e.message);
  }
}

// =========================================================================
// 3. FRONT PAGE: IMAGE 1 APP-ICON STYLE GAMES GRID
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
      g.title.toLowerCase().includes(q) ||
      (g.description && g.description.toLowerCase().includes(q))
    );
  }

  gamesScrollList.innerHTML = '';

  games.forEach(game => {
    const unlocked = isGameUnlocked(game.id);
    const stats = userStats[game.id] || {};
    const currentStreak = stats.current_streak ?? 0;

    const card = document.createElement('div');
    card.className = 'game-card-box';
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Play ${game.title}`);

    let topPillHtml = '';
    if (unlocked) {
      topPillHtml = `<div class="game-card-streak-pill" title="Daily Streak">🔥 ${currentStreak}</div>`;
    } else {
      topPillHtml = `<div class="game-card-locked-pill" title="Unlock for ${game.gameUnlockCost || 100} Coins">🔒 ${game.gameUnlockCost || 100}</div>`;
    }

    card.innerHTML = `
      <img src="${game.thumbnail || '/images/gamify-logo.png'}" class="game-cover-img" alt="${game.title}" loading="lazy" />
      ${topPillHtml}
      <div class="game-card-bottom-banner">${game.title}</div>
    `;

    card.addEventListener('click', () => {
      handleGameCardClick(game);
    });

    gamesScrollList.appendChild(card);
  });
}

// Client-side Instant Game Search
gameSearchInput?.addEventListener('input', () => {
  renderGamesScrollList(gameSearchInput.value.trim());
});

async function handleGameCardClick(game) {
  if (!currentUser) {
    openAuthModal('login', '', 'Please create a profile or unlock with your 4-digit PIN to play and save your coins & streaks.');
    return;
  }

  enterGame(game.id);
}

// =========================================================================
// 4. IMAGE 2 LAUNCHER & GAME ARENA LIFECYCLE
// =========================================================================

function updateLauncherInfiniteUI(gameId) {
  const container = document.getElementById('launcher-infinite-status-row');
  if (!container) return;
  const hasInfinite = Boolean(userUnlocks[gameId]?.playground_unlocked || userUnlocks[gameId]?.infinite_mode);
  if (hasInfinite) {
    container.innerHTML = `
      <div class="badge" style="background:#e0f2fe; color:#0284c7; border-color:#bae6fd; font-weight:800; font-size:0.82rem; padding:0.4rem 0.9rem;">
        ♾️ Infinite Mode Active
      </div>
    `;
  } else {
    container.innerHTML = `
      <button type="button" id="btn-unlock-infinite-launcher" class="game-action-btn btn-unlock-gold" style="padding:0.45rem 1rem; font-size:0.82rem; border-radius:9999px; margin:0 auto; max-width:280px; box-shadow:0 2px 8px rgba(245,158,11,0.25);">
        ♾️ Unlock Infinite Mode (250 Coins)
      </button>
    `;
    container.querySelector('#btn-unlock-infinite-launcher')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      await unlockInfiniteMode(gameId);
    });
  }
}

async function unlockInfiniteMode(gameId) {
  if (!currentUser) {
    openAuthModal('login', '', 'Please login to unlock Infinite Mode.');
    return;
  }
  const cost = 250;
  if ((currentUser.coins ?? 0) < cost) {
    alert(`Insufficient coins. Unlocking Infinite Mode costs ${cost} coins, you have ${currentUser.coins ?? 0} coins.`);
    return;
  }
  try {
    const res = await api.unlockTier(gameId, 'infinite');
    if (res && res.unlocks) {
      userUnlocks[gameId] = res.unlocks;
      if (res.remainingCoins !== undefined) currentUser.coins = res.remainingCoins;
    } else {
      userUnlocks[gameId] = { ...(userUnlocks[gameId] || {}), playground_unlocked: 1, infinite_mode: 1 };
      currentUser.coins -= cost;
    }
    updateAuthUI();
    updateScoreDisplay();
    updateLauncherInfiniteUI(gameId);
    idbSet('gamify_user', currentUser).catch(() => {});
    idbSet('gamify_unlocks', userUnlocks).catch(() => {});
    const gameName = getAllGames().find(g => g.id === gameId)?.title || gameId;
    alert(`🎉 Infinite Mode unlocked for ${gameName}! You can now play unlimited puzzles anytime after solving the daily puzzle.`);
  } catch (err) {
    alert('Failed to unlock Infinite Mode: ' + (err.message || 'Server error'));
  }
}

function setLauncherDifficulty(tier) {
  currentTier = tier;
  const config = DIFFICULTY_TIERS.find(d => d.tier === tier) || DIFFICULTY_TIERS[0];

  if (launcherDiffAvatar) launcherDiffAvatar.textContent = config.avatar;
  if (launcherDiffTitle) {
    launcherDiffTitle.textContent = config.label;
    launcherDiffTitle.style.color = config.color;
  }
  if (launcherSliderFill) {
    launcherSliderFill.style.width = config.fillWidth;
    launcherSliderFill.style.backgroundColor = config.color;
  }
  if (launcherSliderKnob) {
    const idx = DIFFICULTY_TIERS.findIndex(d => d.tier === tier);
    const total = Math.max(1, DIFFICULTY_TIERS.length - 1);
    const pct = (idx / total) * 100;
    launcherSliderKnob.style.left = `calc(${pct}% - ${idx === 0 ? '0px' : idx === total ? '32px' : '16px'})`;
    launcherSliderKnob.style.borderColor = config.color;
  }
}

// Drag & Tap adjustment on difficulty track (Image 2)
launcherSliderTrack?.addEventListener('click', (e) => {
  const rect = launcherSliderTrack.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  const total = DIFFICULTY_TIERS.length - 1;
  const index = Math.round(ratio * total);
  const selectedTier = DIFFICULTY_TIERS[index].tier;
  setLauncherDifficulty(selectedTier);
});

async function enterGame(gameId) {
  activeGameId = gameId;
  isInfinitePlay = false;
  const game = getAllGames().find(g => g.id === gameId);

  if (launcherGameTitle) launcherGameTitle.textContent = (game?.title || gameId).toUpperCase();
  if (launcherGameDesc) launcherGameDesc.textContent = game?.description || 'Daily puzzle challenge';

  setLauncherDifficulty('easy');
  updateLauncherInfiniteUI(gameId);

  // Show launcher screen, hide arena
  gameLauncherScreen?.classList.remove('hidden');
  gameArenaScreen?.classList.add('hidden');

  frontPageView.classList.add('hidden');
  gameView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  updateScoreDisplay();
  loadLeaderboard();
}

launcherBtnPlay?.addEventListener('click', async () => {
  // Check if base game is unlocked
  if (!isGameUnlocked(activeGameId)) {
    const game = getAllGames().find(g => g.id === activeGameId);
    const cost = game?.gameUnlockCost || 100;
    const confirmUnlock = confirm(`Unlock ${game?.title || activeGameId} for ${cost} coins?\n\nYour Balance: ${currentUser.coins ?? 0} coins`);
    if (confirmUnlock) {
      await unlockGameBase(activeGameId, cost);
    }
    return;
  }

  // Check if chosen tier is unlocked
  if (!isTierUnlocked(activeGameId, currentTier)) {
    const tierCosts = { easy: 50, medium: 150, hard: 300 };
    const cost = tierCosts[currentTier] || 150;
    const confirmUnlock = confirm(`Unlock ${currentTier.toUpperCase()} tier for ${cost} coins?\n\nYour Balance: ${currentUser.coins ?? 0} coins`);
    if (confirmUnlock) {
      await unlockSpecificTier(activeGameId, currentTier);
    }
    return;
  }

  // Both unlocked, transition to active arena
  gameLauncherScreen?.classList.add('hidden');
  gameArenaScreen?.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  await loadCurrentPuzzle();
});

btnBackToModes?.addEventListener('click', () => {
  stopPuzzleTimer();
  isInfinitePlay = false;
  if (activeGameCleanup) {
    try { activeGameCleanup(); } catch {}
    activeGameCleanup = null;
  }
  updateLauncherInfiniteUI(activeGameId);
  gameArenaScreen?.classList.add('hidden');
  gameLauncherScreen?.classList.remove('hidden');
});

function returnToHome() {
  stopPuzzleTimer();
  isInfinitePlay = false;
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

btnLauncherBack?.addEventListener('click', returnToHome);
brandLogo?.addEventListener('click', returnToHome);

// =========================================================================
// 5. IMAGE 3 CLEAN HELP RULES DIALOG
// =========================================================================

const GAME_HELP_CONTENT = {
  wordle: `
    <p style="margin-top:0"><strong>Goal:</strong> Guess the hidden 5-letter word in 6 tries.</p>
    <ul style="padding-left:1.2rem; margin:0.5rem 0;">
      <li><strong style="color:#10b981">Green:</strong> Letter is correct and in the right position.</li>
      <li><strong style="color:#f59e0b">Yellow:</strong> Letter is in the word but wrong position.</li>
      <li><strong style="color:#64748b">Grey:</strong> Letter is not in the mystery word.</li>
    </ul>
    <p style="margin-bottom:0">Solve in under 30s to secure maximum Speed Bonus points!</p>
  `,
  'number-grid': `
    <p style="margin-top:0"><strong>Goal:</strong> Fill in the missing numbers to balance row and column target sums.</p>
    <ul style="padding-left:1.2rem; margin:0.5rem 0;">
      <li>Deduce each missing cell using basic arithmetic.</li>
      <li>Each row total and column total must exactly match its target.</li>
    </ul>
  `,
  'number-trail': `
    <p style="margin-top:0"><strong>Goal:</strong> Draw one continuous unbroken path visiting all numbers in sequence.</p>
    <ul style="padding-left:1.2rem; margin:0.5rem 0;">
      <li>Connect from 1 to the highest checkpoint number.</li>
      <li>Every single board square must be visited exactly once.</li>
    </ul>
  `,
  sudoku: `
    <p style="margin-top:0"><strong>Goal:</strong> Fill the grid so digits 1 to 9 appear without repetition.</p>
    <ul style="padding-left:1.2rem; margin:0.5rem 0;">
      <li>Each row contains unique digits.</li>
      <li>Each column contains unique digits.</li>
      <li>Each subgrid contains unique digits.</li>
    </ul>
  `,
  'memory-match': `
    <p style="margin-top:0"><strong>Goal:</strong> Flip cards and match all emoji pairs with fewest moves.</p>
    <ul style="padding-left:1.2rem; margin:0.5rem 0;">
      <li>Memorize flipped cards to find their partners.</li>
      <li>Speed and low move count award maximum points!</li>
    </ul>
  `,
  crossword: `
    <p style="margin-top:0"><strong>Goal:</strong> Fill the 5×5 grid with intersecting words using Across & Down clues.</p>
    <ul style="padding-left:1.2rem; margin:0.5rem 0;">
      <li>Tap a cell or clue to toggle between Across & Down directions.</li>
      <li>Type letters using your keyboard or on-screen keys.</li>
      <li>Speed and accuracy award maximum leaderboard points!</li>
    </ul>
  `
};

function showGameHelp(gameId) {
  const game = getAllGames().find(g => g.id === gameId);
  if (!game) return;

  if (helpDialogIcon) helpDialogIcon.textContent = game.icon || '📖';
  if (helpDialogTitle) helpDialogTitle.textContent = `${game.title} - Rules`;
  if (helpDialogBody) {
    helpDialogBody.innerHTML = GAME_HELP_CONTENT[gameId] || `<p>${game.description}</p>`;
  }

  helpDialogModal?.classList.remove('hidden');
}

launcherBtnHelp?.addEventListener('click', () => showGameHelp(activeGameId));
btnLauncherHelpTop?.addEventListener('click', () => showGameHelp(activeGameId));
btnOpenRules?.addEventListener('click', () => showGameHelp(activeGameId));
btnHelpDialogOk?.addEventListener('click', () => helpDialogModal?.classList.add('hidden'));
helpDialogModal?.addEventListener('click', (e) => {
  if (e.target === helpDialogModal) helpDialogModal.classList.add('hidden');
});

// =========================================================================
// 6. PUZZLE EXECUTION & OPTIMISTIC SCORE SUBMISSION
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
  const sweepContainer = document.getElementById('sweep-progress-bar');
  if (!sweepContainer) return;

  const allGames = getAllGames();
  // Dynamically sort games by user's current streak ascending (lowest streaks first)
  const sortedGames = [...allGames].sort((a, b) => {
    const streakA = userStats[a.id]?.current_streak ?? 0;
    const streakB = userStats[b.id]?.current_streak ?? 0;
    return streakA - streakB || a.title.localeCompare(b.title);
  }).slice(0, 6);

  let completedCount = 0;
  sweepContainer.innerHTML = sortedGames.map(game => {
    const isCompleted = Array.from(todayCompletions).some(c => c.startsWith(`${game.id}:`));
    if (isCompleted) completedCount++;
    const streak = userStats[game.id]?.current_streak ?? 0;
    return `
      <div class="sweep-game-pill ${isCompleted ? 'completed' : ''}" data-game-id="${game.id}" style="cursor:pointer;" title="Current Streak: ${streak} | Click to play">
        <span class="sweep-pill-name">${game.icon || '🎮'} ${game.title} <small style="opacity:0.8; font-size:0.75rem;">(🔥${streak})</small></span>
        <span class="sweep-pill-status">${isCompleted ? '✅' : '⏳'}</span>
      </div>
    `;
  }).join('');

  sweepContainer.querySelectorAll('.sweep-game-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const gId = pill.dataset.gameId;
      if (gId) enterGame(gId);
    });
  });

  const totalSweep = sortedGames.length;
  if (sweepStatusDesc) {
    if (completedCount === totalSweep && totalSweep > 0) {
      sweepStatusDesc.textContent = `🎉 All ${totalSweep} Daily Sweep challenges conquered today! +50 Bonus Claimed!`;
    } else {
      sweepStatusDesc.textContent = `Completed ${completedCount}/${totalSweep} daily puzzles (focused on your lowest streaks). Conquer all for +50 Bonus Coins!`;
    }
  }
}

async function loadCurrentPuzzle(isNewInfinite = false) {
  const dateStr = getTodayDateStr();

  // 1. Verify game is unlocked
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

  // 2. Verify tier is unlocked
  if (!isTierUnlocked(activeGameId, currentTier)) {
    if (activeGameCleanup) {
      try { activeGameCleanup(); } catch {}
      activeGameCleanup = null;
    }
    activeGameContainer.classList.add('hidden');
    lockedTierContainer.classList.remove('hidden');
    const tierCosts = { easy: 50, medium: 150, hard: 300 };
    const cost = tierCosts[currentTier] || 150;

    lockedBannerTitle.textContent = `${currentTier.toUpperCase()} Tier Locked`;
    lockedBannerDesc.textContent = `Unlock ${currentTier.toUpperCase()} tier for ${cost} coins to play and earn bigger rewards.`;

    unlockActionBtn.textContent = `Unlock ${currentTier.toUpperCase()} (${cost} Coins) 🪙`;
    unlockActionBtn.onclick = async () => {
      await unlockSpecificTier(activeGameId, currentTier);
    };
    return;
  }

  lockedTierContainer.classList.add('hidden');
  activeGameContainer.classList.remove('hidden');

  const hasInfinite = Boolean(userUnlocks[activeGameId]?.playground_unlocked || userUnlocks[activeGameId]?.infinite_mode);
  const isAlreadyCompletedToday = todayCompletions.has(`${activeGameId}:${currentTier}`);

  if (activeGameCleanup) {
    try { activeGameCleanup(); } catch (err) { console.warn('Game cleanup note:', err); }
    activeGameCleanup = null;
  }

  // 3. If daily tier already completed today and not in active infinite play
  if (isAlreadyCompletedToday && !isInfinitePlay) {
    stopPuzzleTimer();
    gameBadge.textContent = `Daily ${currentTier.toUpperCase()} (${dateStr}) · Completed`;
    statusEl.textContent = 'Completed for today';
    statusEl.style.color = 'var(--correct-bg)';
    newGameBtn.style.display = 'none';

    if (hasInfinite) {
      gameArenaContent.innerHTML = `
        <div class="daily-completed-view" style="text-align:center; padding: 2.5rem 1rem;">
          <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🎉</div>
          <h3 style="font-size: 1.45rem; color: #166534; margin-bottom: 0.5rem;">
            Daily ${currentTier.toUpperCase()} Solved!
          </h3>
          <p style="color: #15803d; font-size: 0.95rem; max-width: 480px; margin: 0 auto 1.5rem auto; line-height: 1.5;">
            You conquered today's daily puzzle! Since you have <strong>Infinite Mode</strong> unlocked, you can play endless puzzles for all unlocked difficulties anytime!
          </p>
          <button id="btn-play-infinite-now" class="launcher-btn-play" style="max-width: 280px; margin: 0 auto; display:block;">
            Play Infinite Mode ♾️
          </button>
        </div>
      `;

      document.getElementById('btn-play-infinite-now')?.addEventListener('click', () => {
        isInfinitePlay = true;
        loadCurrentPuzzle();
      });
    } else {
      gameArenaContent.innerHTML = `
        <div class="daily-completed-view" style="text-align:center; padding: 2.5rem 1rem;">
          <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🎉</div>
          <h3 style="font-size: 1.45rem; color: #166534; margin-bottom: 0.5rem;">
            Daily ${currentTier.toUpperCase()} Solved!
          </h3>
          <p style="color: #15803d; font-size: 0.95rem; max-width: 480px; margin: 0 auto 1.5rem auto; line-height: 1.5;">
            You conquered today's challenge. Daily puzzles refresh every midnight UTC. Unlock Infinite Mode to practice and play endless puzzles right now!
          </p>
          <button id="btn-unlock-infinite-solved" class="game-action-btn btn-unlock-gold" style="max-width: 320px; margin: 0 auto; display:flex; justify-content:center; padding:0.8rem 1.4rem; font-size:1rem; border-radius:9999px;">
            ♾️ Unlock Infinite Mode (250 Coins)
          </button>
        </div>
      `;

      document.getElementById('btn-unlock-infinite-solved')?.addEventListener('click', async () => {
        await unlockInfiniteMode(activeGameId);
        isInfinitePlay = true;
        loadCurrentPuzzle();
      });
    }

    return;
  }

  // 4. Setup puzzle for play (Lazy loads game module)
  newGameBtn.style.display = 'inline-block';
  if (isInfinitePlay) {
    newGameBtn.textContent = '♾️ Next Puzzle';
    currentPuzzle = await getPlaygroundPuzzle(activeGameId, currentTier);
    gameBadge.textContent = `Infinite ${currentTier.toUpperCase()} Mode ♾️`;
  } else {
    newGameBtn.textContent = '↺ Reset Puzzle';
    currentPuzzle = await getDailyPuzzle(activeGameId, currentTier, dateStr);
    gameBadge.textContent = `Daily ${currentTier.toUpperCase()} (${dateStr})`;
  }

  startTime = Date.now();
  startPuzzleTimer();

  // Mount active game dynamically via plug-and-play lifecycle
  const game = await loadGameConfig(activeGameId);
  if (typeof game.mount === 'function') {
    activeGameCleanup = game.mount(gameArenaContent, currentPuzzle, {
      onWin: (score, timeTakenMs, extraCtx) => handleGameWin(activeGameId, currentTier, score, timeTakenMs, extraCtx),
      showStatus: (msg, color) => showStatus(msg, color),
      setRules: (html) => { if (gameRulesBox) gameRulesBox.innerHTML = html; },
      onHint: async (gameId) => {
        const res = await api.useHint(gameId);
        currentUser.coins = res.remainingCoins;
        updateAuthUI();
        return res;
      }
    });
  } else {
    gameArenaContent.innerHTML = `<p style="color:var(--danger); padding:2rem; text-align:center;">Game module for '${activeGameId}' has no mount export.</p>`;
  }
}

// -------------------------------------------------------------------------
// OPTIMISTIC SCORE SUBMISSION & CONFETTI VICTORY (Requirements 7, 9)
// -------------------------------------------------------------------------

function showSolveVictory(score, coins) {
  if (solveVictoryScore) solveVictoryScore.textContent = `+${score}`;
  if (solveVictoryCoins) solveVictoryCoins.textContent = `+${coins} 🪙 Coins Earned`;
  solveVictoryModal?.classList.remove('hidden');
  launchConfetti(140);
}

btnSolveVictoryOk?.addEventListener('click', () => {
  solveVictoryModal?.classList.add('hidden');
  loadCurrentPuzzle();
});
solveVictoryModal?.addEventListener('click', (e) => {
  if (e.target === solveVictoryModal) {
    solveVictoryModal.classList.add('hidden');
    loadCurrentPuzzle();
  }
});

async function handleGameWin(gameId, tier, earnedPoints, customTimeTakenMs, extraCtx) {
  stopPuzzleTimer();
  const timeTakenMs = customTimeTakenMs || Math.max(1500, Date.now() - startTime);

  let speedBonus = 0;
  if (timeTakenMs < 30000) speedBonus = 50;
  else if (timeTakenMs < 60000) speedBonus = 25;
  else if (timeTakenMs < 120000) speedBonus = 10;

  const totalPoints = earnedPoints + speedBonus;

  // Optimistic calculation
  const tierRewards = { easy: 15, medium: 35, hard: 75, playground: 0 };
  const baseReward = tierRewards[tier] || 15;
  const currentMultiplier = (currentUser && currentUser.streakCount >= 2) ? 1.2 : 1.0;
  const optimisticCoins = Math.round(baseReward * currentMultiplier);

  // Snapshot previous state for rollback on network failure
  const prevCoins = currentUser?.coins ?? 0;
  const prevStreak = currentUser?.streakCount ?? 0;
  const prevStats = { ...(userStats[gameId] || {}) };
  const prevCompletions = new Set(todayCompletions);

  // 1. OPTIMISTIC UPDATE: Update UI instantly before worker responds!
  if (tier !== 'playground') {
    todayCompletions.add(`${gameId}:${tier}`);
    if (currentUser) {
      currentUser.coins = prevCoins + optimisticCoins;
      currentUser.streakCount = prevStreak + 1;
    }
  }

  const currentStats = userStats[gameId] || { total_score: 0, plays_count: 0, best_score: 0, best_streak: 0 };
  userStats[gameId] = {
    ...currentStats,
    total_score: (currentStats.total_score || 0) + totalPoints,
    plays_count: (currentStats.plays_count || 0) + 1,
    best_score: Math.max(currentStats.best_score || 0, totalPoints),
  };

  updateAuthUI();
  updateScoreDisplay();
  updateDailySweepUI();

  // Instant Confetti & Clean Victory Screen (No math formulas)
  showSolveVictory(totalPoints, optimisticCoins);

  // Write optimistic state to IndexedDB
  idbSet('gamify_user', currentUser).catch(() => {});
  idbSet('gamify_stats', userStats).catch(() => {});
  idbSet('gamify_completions', Array.from(todayCompletions)).catch(() => {});

  // 2. Background Server Sync
  try {
    const res = await api.submitScore({
      gameId,
      difficulty: tier,
      score: totalPoints,
      timeTakenMs,
      wordleTries: extraCtx?.wordleTries,
      dateStr: getTodayDateStr(),
    });

    if (res.stats) {
      userStats[gameId] = res.stats;
    }
    if (res.levelInfo && currentUser) {
      currentUser.xp = res.totalXp;
      updateLevelUI(res.levelInfo);
    }
    if (res.coinsAwarded !== undefined && currentUser) {
      currentUser.coins = res.currentCoins;
      currentUser.streakCount = res.streakCount;
      updateAuthUI();
    }

    idbSet('gamify_user', currentUser).catch(() => {});
    idbSet('gamify_stats', userStats).catch(() => {});

    // Resolve active PvP Challenge if playing in challenge mode
    if (activeChallenge) {
      try {
        await api.respondChallenge({
          challengeId: activeChallenge.id,
          action: 'complete',
          score: totalPoints,
          timeTakenMs,
        });
        activeChallenge = null;
        activeChallengeBanner?.classList.add('hidden');
        await loadChallenges();
      } catch (chalErr) {
        console.warn('Challenge submit error:', chalErr);
      }
    }

    loadLeaderboard();
  } catch (e) {
    console.warn('Score submission note:', e.message);
    if (e.code === 'DAILY_ALREADY_COMPLETED') {
      todayCompletions.add(`${gameId}:${tier}`);
      updateDailySweepUI();
    } else {
      // Rollback optimistic state
      if (currentUser) {
        currentUser.coins = prevCoins;
        currentUser.streakCount = prevStreak;
      }
      userStats[gameId] = prevStats;
      todayCompletions = prevCompletions;
      updateAuthUI();
      updateScoreDisplay();
      updateDailySweepUI();
      alert('Network sync note: ' + (e.message || 'Score rollback applied'));
    }
  }
}

async function unlockGameBase(gameId, cost) {
  try {
    const res = await api.unlockTier(gameId, 'game');
    userUnlocks[gameId] = res.unlocks;
    if (currentUser) currentUser.coins = res.remainingCoins;
    updateAuthUI();
    renderGamesScrollList();
    idbSet('gamify_unlocks', userUnlocks).catch(() => {});
    idbSet('gamify_user', currentUser).catch(() => {});
    alert(`🎉 Successfully unlocked ${gameId}!`);
  } catch (err) {
    alert(err.message || 'Failed to unlock game');
  }
}

async function unlockSpecificTier(gameId, tier) {
  try {
    unlockActionBtn.disabled = true;
    unlockActionBtn.textContent = 'Unlocking...';

    const res = await api.unlockTier(gameId, tier);
    userUnlocks[gameId] = res.unlocks;
    if (currentUser) currentUser.coins = res.remainingCoins;
    updateAuthUI();
    idbSet('gamify_unlocks', userUnlocks).catch(() => {});
    idbSet('gamify_user', currentUser).catch(() => {});
    alert(`🎉 Successfully unlocked ${tier.toUpperCase()} tier!`);
    await loadCurrentPuzzle();
  } catch (err) {
    alert(err.message || 'Failed to unlock tier');
  } finally {
    unlockActionBtn.disabled = false;
  }
}

function showStatus(msg, color) {
  if (statusEl) {
    statusEl.innerText = msg;
    if (color) statusEl.style.color = color;
  }
}

function updateScoreDisplay() {
  const stats = userStats[activeGameId] || { total_score: 0, plays_count: 0 };
  if (totalScoreEl) totalScoreEl.innerText = stats.total_score ?? 0;
  if (gamesWonEl) gamesWonEl.innerText = stats.plays_count ?? 0;
}

newGameBtn?.addEventListener('click', () => {
  loadCurrentPuzzle(isInfinitePlay);
});

// =========================================================================
// 7. FOLLOWERS & FOLLOWING SOCIAL SYSTEM (Requirement 2)
// =========================================================================

function renderFollowersFollowingUI() {
  if (profileFollowersCount) profileFollowersCount.textContent = userFollowersCount;
  if (profileFollowingCount) profileFollowingCount.textContent = userFollowingCount;
  if (tabFollowingCount) tabFollowingCount.textContent = userFollowing.length;
  if (tabFollowersCount) tabFollowersCount.textContent = userFollowers.length;

  // Render Following List
  if (profileFollowingList) {
    if (userFollowing.length === 0) {
      profileFollowingList.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem; padding:1rem; text-align:center;">You are not following anyone yet. Search players to follow!</div>';
    } else {
      profileFollowingList.innerHTML = userFollowing.map(f => `
        <div class="friend-item">
          <div>
            <div class="friend-name" data-username="${f.username}">${f.display_name || f.username}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">@${f.username}</div>
          </div>
          <button type="button" class="btn-lock unfollow-btn" data-id="${f.id}" data-username="${f.username}" style="padding:0.25rem 0.6rem; font-size:0.75rem;">Unfollow</button>
        </div>
      `).join('');

      profileFollowingList.querySelectorAll('.friend-name').forEach(el => {
        el.addEventListener('click', () => openPublicProfile(el.dataset.username));
      });

      profileFollowingList.querySelectorAll('.unfollow-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          await unfollowPlayer(btn.dataset.id, btn.dataset.username);
        });
      });
    }
  }

  // Render Followers List
  if (profileFollowersList) {
    if (userFollowers.length === 0) {
      profileFollowersList.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem; padding:1rem; text-align:center;">No followers yet. Climb the leaderboards to get discovered!</div>';
    } else {
      profileFollowersList.innerHTML = userFollowers.map(f => {
        const isFollowingBack = userFollowing.some(u => u.id === f.id || u.username === f.username);
        return `
          <div class="friend-item">
            <div>
              <div class="friend-name" data-username="${f.username}">${f.display_name || f.username}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">@${f.username}</div>
            </div>
            ${isFollowingBack
              ? `<span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">Following</span>`
              : `<button type="button" class="btn-login follow-back-btn" data-username="${f.username}" style="padding:0.25rem 0.6rem; font-size:0.75rem;">Follow Back</button>`
            }
          </div>
        `;
      }).join('');

      profileFollowersList.querySelectorAll('.friend-name').forEach(el => {
        el.addEventListener('click', () => openPublicProfile(el.dataset.username));
      });

      profileFollowersList.querySelectorAll('.follow-back-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          await followPlayer(btn.dataset.username);
        });
      });
    }
  }
}

tabBtnFollowing?.addEventListener('click', () => {
  tabBtnFollowing.classList.add('active');
  tabBtnFollowers?.classList.remove('active');
  profileFollowingList?.classList.remove('hidden');
  profileFollowersList?.classList.add('hidden');
});

tabBtnFollowers?.addEventListener('click', async () => {
  tabBtnFollowers.classList.add('active');
  tabBtnFollowing?.classList.remove('active');
  profileFollowersList?.classList.remove('hidden');
  profileFollowingList?.classList.add('hidden');

  try {
    const res = await api.getFriends();
    if (res.followers) {
      userFollowers = res.followers;
      userFollowersCount = res.followersCount ?? userFollowers.length;
      renderFollowersFollowingUI();
    }
  } catch (err) {
    console.warn('Load followers note:', err);
  }
});

async function followPlayer(username) {
  if (!username) return;
  try {
    const res = await api.addFriend(username);
    if (res.friend) {
      userFollowing.push(res.friend);
      userFollowingCount = userFollowing.length;
      idbSet('gamify_following', userFollowing).catch(() => {});
      renderFollowersFollowingUI();
      if (profileFriendsFeedback) {
        profileFriendsFeedback.textContent = `✓ Now following @${username}!`;
        profileFriendsFeedback.style.color = 'var(--correct-bg)';
        profileFriendsFeedback.style.display = 'block';
      }
    }
  } catch (err) {
    if (profileFriendsFeedback) {
      profileFriendsFeedback.textContent = `⚠️ ${err.message || 'Failed to follow player'}`;
      profileFriendsFeedback.style.color = 'var(--danger)';
      profileFriendsFeedback.style.display = 'block';
    }
  }
}

async function unfollowPlayer(friendId, username) {
  try {
    await api.removeFriend(friendId, username);
    userFollowing = userFollowing.filter(f => f.id !== friendId && f.username !== username);
    userFollowingCount = userFollowing.length;
    idbSet('gamify_following', userFollowing).catch(() => {});
    renderFollowersFollowingUI();
  } catch (err) {
    alert(err.message || 'Failed to unfollow player');
  }
}

btnAddFriend?.addEventListener('click', async () => {
  const targetUsername = addFriendInput?.value?.trim();
  if (!targetUsername) return;
  btnAddFriend.disabled = true;
  await followPlayer(targetUsername);
  if (addFriendInput) addFriendInput.value = '';
  btnAddFriend.disabled = false;
});

// =========================================================================
// 8. PROFILE MODALS & 350MS DEBOUNCED SEARCH (Requirement 12)
// =========================================================================

function openProfileModal() {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }
  profileDisplayName.textContent = currentUser.displayName || currentUser.username;
  profileUsername.textContent = `@${currentUser.username}`;
  profileAboutInput.value = currentUser.about || '';
  if (profileFriendsFeedback) profileFriendsFeedback.style.display = 'none';

  // Render best streaks in descending order
  if (profileStreaksGrid) {
    const allGames = getAllGames();
    const sortedGames = [...allGames].map(g => {
      const stats = userStats[g.id] || {};
      return { ...g, bestStreak: stats.best_streak ?? 0 };
    }).sort((a, b) => b.bestStreak - a.bestStreak || a.title.localeCompare(b.title));

    profileStreaksGrid.innerHTML = sortedGames.map(g => `
      <div class="streak-card">
        <div class="game-label">${g.title}</div>
        <div class="streak-val">🔥 ${g.bestStreak}</div>
      </div>
    `).join('');
  }

  renderFollowersFollowingUI();
  profileModal.classList.remove('hidden');
}

btnOpenProfile?.addEventListener('click', openProfileModal);
profileModalClose?.addEventListener('click', () => profileModal.classList.add('hidden'));
profileModal?.addEventListener('click', (e) => {
  if (e.target === profileModal) profileModal.classList.add('hidden');
});

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

// Public Player Profile
async function openPublicProfile(username) {
  try {
    const res = await api.getUserProfile(username);
    currentPublicUser = res.profile;

    if (publicProfileGamertag) publicProfileGamertag.textContent = currentPublicUser.gamertag || currentPublicUser.displayName || currentPublicUser.username;
    if (publicProfileHandle) publicProfileHandle.textContent = `@${currentPublicUser.username}`;
    if (publicProfileAbout) publicProfileAbout.textContent = currentPublicUser.about || 'No description provided yet.';
    if (publicProfileFollowersCount) publicProfileFollowersCount.textContent = currentPublicUser.followersCount ?? 0;
    if (publicProfileFollowingCount) publicProfileFollowingCount.textContent = currentPublicUser.followingCount ?? 0;

    applyCosmeticToAvatar(publicProfileAvatar, currentPublicUser.selectedFrame);

    if (publicProfileCustomTitle) {
      if (currentPublicUser.selectedTitle) {
        publicProfileCustomTitle.textContent = formatTitleName(currentPublicUser.selectedTitle);
        publicProfileCustomTitle.classList.remove('hidden');
      } else {
        publicProfileCustomTitle.classList.add('hidden');
      }
    }

    if (publicProfileLevel) {
      publicProfileLevel.textContent = `Lvl ${currentPublicUser.level || 1} · ${currentPublicUser.levelTitle || 'Novice'}`;
    }

    const isFollowing = userFollowing.some(f => f.username?.toLowerCase() === currentPublicUser.username?.toLowerCase());
    const isSelf = currentUser && currentUser.username === currentPublicUser.username;

    if (isSelf) {
      btnToggleFriendPublic.style.display = 'none';
    } else {
      btnToggleFriendPublic.style.display = 'block';
      btnToggleFriendPublic.textContent = isFollowing ? 'Unfollow' : 'Follow Player';
      btnToggleFriendPublic.className = isFollowing ? 'btn-lock' : 'btn-login';
      btnToggleFriendPublic.onclick = async () => {
        if (isFollowing) {
          await unfollowPlayer(currentPublicUser.id, currentPublicUser.username);
        } else {
          await followPlayer(currentPublicUser.username);
        }
        await openPublicProfile(currentPublicUser.username);
      };
    }

    // Streaks in descending order
    const publicStreaksGrid = document.getElementById('public-profile-streaks-grid');
    if (publicStreaksGrid) {
      const allGames = getAllGames();
      const userStreaks = currentPublicUser.streaks || [];
      const streakMap = new Map();
      userStreaks.forEach(s => streakMap.set(s.game_id, s.best_streak ?? 0));

      const sortedGames = [...allGames].map(g => {
        const best = streakMap.get(g.id) || 0;
        return { ...g, bestStreak: best };
      }).sort((a, b) => b.bestStreak - a.bestStreak || a.title.localeCompare(b.title));

      publicStreaksGrid.innerHTML = sortedGames.map(g => `
        <div class="streak-card">
          <div class="game-label">${g.title}</div>
          <div class="streak-val">🔥 ${g.bestStreak}</div>
        </div>
      `).join('');
    }

    publicProfileModal?.classList.remove('hidden');
  } catch (err) {
    alert(err.message || 'Could not find player');
  }
}

publicProfileClose?.addEventListener('click', () => publicProfileModal?.classList.add('hidden'));
publicProfileModal?.addEventListener('click', (e) => {
  if (e.target === publicProfileModal) publicProfileModal?.classList.add('hidden');
});

// Debounced Player Search (350ms debounce)
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
  }, 350);
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.player-search-wrapper')) {
    playerSearchDropdown?.classList.add('hidden');
  }
});

// =========================================================================
// 9. COSMETICS, SHOP & XP LEVELING
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
  if (headerUserLevel) headerUserLevel.textContent = `Lvl ${levelInfo.level}`;
  if (profileUserLevel) profileUserLevel.textContent = `Lvl ${levelInfo.level}`;
  if (profileLevelTitle) profileLevelTitle.textContent = levelInfo.title;

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

  shopItemsContainer.innerHTML = filtered.map(item => {
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
      actionBtn = `<button class="btn-shop-buy game-action-btn ${canAfford ? 'btn-unlock-gold' : 'btn-lock'}" data-id="${item.id}" data-cost="${item.cost}" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;" ${canAfford ? '' : 'disabled'}>Buy ${item.cost} 🪙</button>`;
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

  shopItemsContainer.querySelectorAll('.btn-shop-buy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const itemId = btn.dataset.id;
      btn.disabled = true;
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
      }
    });
  });

  shopItemsContainer.querySelectorAll('.btn-shop-equip').forEach(btn => {
    btn.addEventListener('click', async () => {
      const itemId = btn.dataset.id;
      const type = btn.dataset.type;
      btn.disabled = true;
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
// 10. PVP CHALLENGES
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

async function loadChallenges() {
  if (!currentUser || !api.token) return;
  try {
    const res = await api.getChallenges();
    challengesCache = res;

    if (headerUpdatesBadge) {
      headerUpdatesBadge.textContent = res.pendingCount > 0 ? `Challenges (${res.pendingCount}) 🔥` : 'Challenges 🎯';
    }
    if (challengesIncomingSubcount) {
      challengesIncomingSubcount.textContent = res.pendingCount || 0;
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
          <div style="font-size:0.88rem; color:var(--text-color); margin: 0.35rem 0;">
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
              <div><strong>${c.challenger_display_name}</strong> vs You</div>
              <span style="font-size:0.78rem; font-weight:800; color:${isMeWinner ? '#16a34a' : '#ef4444'};">
                ${isMeWinner ? '🏆 VICTORY' : 'DEFEAT'}
              </span>
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">
              Game: <strong style="text-transform:capitalize;">${c.game_id} (${c.difficulty})</strong> · Target: ${c.target_score} Pts · Your Score: ${c.opponent_score} Pts
            </div>
          </div>
        `;
      }).join('');
    }

    challengesItemsContainer.innerHTML = html;

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
        updatesModal?.classList.add('hidden');
        openPublicProfile(link.dataset.username);
      });
    });
  } else {
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
            <div>To: <strong>${c.opponent_display_name}</strong> (@${c.opponent_username})</div>
            <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">${formatRelativeTime(c.created_at)}</span>
          </div>
          <div style="font-size:0.85rem; color:var(--text-color); margin: 0.25rem 0;">
            Game: <strong style="text-transform:capitalize;">${c.game_id} (${c.difficulty})</strong> · Target Score: <strong style="color:var(--accent);">${c.target_score} Pts</strong>
          </div>
          <div style="font-size:0.78rem; font-weight:700;">
            ${isPending ? '⏳ Awaiting opponent response...' : isWon ? '🏆 You won! (+35 Coins & +50 XP)' : `Defeat (Opponent scored ${c.opponent_score} Pts)`}
          </div>
        </div>
      `;
    }).join('');
  }
}

function playChallenge(challenge) {
  activeChallenge = challenge;
  updatesModal?.classList.add('hidden');

  activeGameId = challenge.game_id;
  currentTier = challenge.difficulty;

  if (activeChallengeBanner && activeChallengeText) {
    activeChallengeText.textContent = `⚔️ Challenge from @${challenge.challenger_username}: Beat ${challenge.target_score} Pts!`;
    activeChallengeBanner.classList.remove('hidden');
  }

  frontPageView.classList.add('hidden');
  gameView.classList.remove('hidden');
  gameLauncherScreen?.classList.add('hidden');
  gameArenaScreen?.classList.remove('hidden');

  loadCurrentPuzzle();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

btnCancelChallengePlay?.addEventListener('click', () => {
  activeChallenge = null;
  activeChallengeBanner?.classList.add('hidden');
  showStatus('Challenge exited.', 'var(--text-muted)');
});

btnOpenUpdates?.addEventListener('click', () => {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }
  updatesModal?.classList.remove('hidden');
  loadChallenges();
});
updatesModalClose?.addEventListener('click', () => updatesModal?.classList.add('hidden'));
updatesModal?.addEventListener('click', (e) => {
  if (e.target === updatesModal) updatesModal?.classList.add('hidden');
});

challengesTabs?.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  challengesTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeChallengeTab = btn.dataset.tab;
  renderChallengesList(activeChallengeTab);
});

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
// 11. LIVE LEADERBOARDS
// =========================================================================

async function loadLeaderboard() {
  const view = document.getElementById('leaderboard-view');
  if (!view) return;
  try {
    const data = await api.getLeaderboard(activeGameId);
    renderLeaderboardView(data);
  } catch (err) {
    view.innerHTML = `<p style="color: var(--danger); font-size: 0.85rem;">Failed to load leaderboard: ${err.message || 'Server error'}</p>`;
  }
}

function renderLeaderboardView(data) {
  const view = document.getElementById('leaderboard-view');
  if (!view) return;

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
      el.addEventListener('click', () => openPublicProfile(el.dataset.username));
    });
    return;
  }

  if (isGlobal || isFriends) {
    const rows = (isFriends ? data.friendsLeaderboard : data.globalLeaderboard) || [];
    if (!rows.length) {
      view.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">${
        isFriends
          ? 'No friends ranked yet. Follow other players from their profile to compare scores!'
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
            <th style="text-align: right;">Total Score</th>
            <th style="text-align: right;">Plays</th>
            <th style="text-align: right;">Best</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => {
            const isMe = currentUser && (r.user_id === currentUser.id || r.username === currentUser.username);
            const rankLabel = i === 0 ? '🥇 #1' : i === 1 ? '🥈 #2' : i === 2 ? '🥉 #3' : `#${i + 1}`;
            const youTag = isMe ? `<span class="you-badge">You</span>` : '';
            const titlePill = r.selected_title ? `<span class="player-custom-title" style="font-size:0.68rem; margin-left:4px;">${formatTitleName(r.selected_title)}</span>` : '';
            const totalScoreVal = r.total_score ?? r.score ?? r.points ?? 0;
            const playsVal = r.plays_count ?? r.games_played ?? 0;
            const bestScoreVal = r.best_score ?? r.score ?? '—';
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
                <td style="text-align: right;"><strong>${totalScoreVal}</strong></td>
                <td style="text-align: right;">${playsVal}</td>
                <td style="text-align: right;">${bestScoreVal}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>`;

    view.querySelectorAll('.leaderboard-player-link').forEach(el => {
      el.addEventListener('click', () => openPublicProfile(el.dataset.username));
    });
    return;
  }

  // Daily standings
  const rows = data.dailyLeaderboard || [];
  if (!rows.length) {
    view.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No daily completions recorded yet for today (${getTodayDateStr()}). Conquer today's puzzle to rank #1!</p>`;
    return;
  }
  view.innerHTML = `
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th style="width: 14%;">Rank</th>
          <th>Player</th>
          <th style="text-align: right;">Daily Score</th>
          <th style="text-align: right;">Time</th>
          <th style="text-align: right;">Difficulty</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((r, i) => {
          const isMe = currentUser && (r.user_id === currentUser.id || r.username === currentUser.username);
          const rankLabel = i === 0 ? '🥇 #1' : i === 1 ? '🥈 #2' : i === 2 ? '🥉 #3' : `#${i + 1}`;
          const youTag = isMe ? `<span class="you-badge">You</span>` : '';
          const timeSec = r.time_taken_ms ? (r.time_taken_ms / 1000).toFixed(1) + 's' : '—';
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
              <td style="text-align: right;"><strong style="color: var(--accent);">${r.score}</strong></td>
              <td style="text-align: right;">${timeSec}</td>
              <td style="text-align: right;"><span class="badge" style="padding: 2px 6px; font-size: 0.72rem;">${r.difficulty}</span></td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>`;

  view.querySelectorAll('.leaderboard-player-link').forEach(el => {
    el.addEventListener('click', () => openPublicProfile(el.dataset.username));
  });
}

function handleTabClick(btn) {
  [btnGlobalTab, btnFriendsTab, btnDailyTab, btnTournamentTab].forEach(b => b?.classList.remove('active'));
  btn.classList.add('active');
  loadLeaderboard();
}

btnGlobalTab?.addEventListener('click', () => handleTabClick(btnGlobalTab));
btnFriendsTab?.addEventListener('click', () => handleTabClick(btnFriendsTab));
btnDailyTab?.addEventListener('click', () => handleTabClick(btnDailyTab));
btnTournamentTab?.addEventListener('click', () => handleTabClick(btnTournamentTab));

// =========================================================================
// 11.1 WORLD WARS ARENA & WEEKLY TOURNAMENTS (Requirement 5)
// =========================================================================

let currentWwFilter = 'all';

const worldWarsPaneGlobal = document.getElementById('world-wars-pane-global');
const worldWarsPaneTournaments = document.getElementById('world-wars-pane-tournaments');

function switchWwTab(tabName) {
  if (tabName === 'global') {
    btnWwTabGlobal?.classList.add('active');
    btnWwTabTournaments?.classList.remove('active');
    worldWarsPaneGlobal?.classList.remove('hidden');
    worldWarsPaneTournaments?.classList.add('hidden');
  } else {
    btnWwTabTournaments?.classList.add('active');
    btnWwTabGlobal?.classList.remove('active');
    worldWarsPaneTournaments?.classList.remove('hidden');
    worldWarsPaneGlobal?.classList.add('hidden');
  }
}

btnWwTabGlobal?.addEventListener('click', () => switchWwTab('global'));
btnWwTabTournaments?.addEventListener('click', () => switchWwTab('tournaments'));

btnOpenWorldWars?.addEventListener('click', () => {
  worldWarsModal?.classList.remove('hidden');
  loadWorldWarsData(currentWwFilter);
});

worldWarsModalClose?.addEventListener('click', () => {
  worldWarsModal?.classList.add('hidden');
});

worldWarsModal?.addEventListener('click', (e) => {
  if (e.target === worldWarsModal) {
    worldWarsModal.classList.add('hidden');
  }
});

worldWarsGameFilter?.addEventListener('change', (e) => {
  currentWwFilter = e.target.value;
  loadWorldWarsData(currentWwFilter);
});

async function loadWorldWarsData(filter = 'all') {
  if (wwPodiumContainer) {
    wwPodiumContainer.innerHTML = `<div style="color: #94a3b8; font-weight: 700; padding: 1.5rem; text-align: center;">⚡ Summoning World Arena Contenders...</div>`;
  }
  if (wwRankedList) {
    wwRankedList.innerHTML = '';
  }

  try {
    const data = await api.getLeaderboard(filter);
    const rows = data.globalLeaderboard || [];

    // 1. Update front page World Wars Card preview
    if (worldWarsWeekLabel) {
      worldWarsWeekLabel.textContent = data.currentWeekId ? data.currentWeekId.replace(/^\d{4}-W?/, 'Week ') : 'Weekly';
    }
    if (worldWarsMyRank) {
      if (currentUser && rows.length > 0) {
        const myIdx = rows.findIndex(r => r.user_id === currentUser.id || r.username === currentUser.username);
        worldWarsMyRank.textContent = myIdx >= 0 ? `#${myIdx + 1}` : '#--';
      } else {
        worldWarsMyRank.textContent = '#--';
      }
    }

    // 2. Render Image 3 Podium & Ranked Cards
    renderWorldWarsPodium(rows);

    // 3. Render Image 4 Tournaments
    renderWorldWarsTournaments(data);
  } catch (err) {
    if (wwPodiumContainer) {
      wwPodiumContainer.innerHTML = `<p style="color: var(--danger); font-size: 0.85rem; padding: 1rem; text-align: center;">Failed to load arena: ${err.message || 'Network error'}</p>`;
    }
  }
}

function renderWorldWarsPodium(rows) {
  if (!wwPodiumContainer || !wwRankedList) return;

  if (!rows || rows.length === 0) {
    wwPodiumContainer.innerHTML = `
      <div style="text-align: center; color: #94a3b8; padding: 2rem 1rem;">
        <span style="font-size: 2.2rem; display: block; margin-bottom: 0.5rem;">⚔️</span>
        <strong style="color: #ffffff; font-size: 1rem;">No Arena Champions Ranked Yet</strong>
        <p style="margin: 0.4rem 0 0 0; font-size: 0.8rem;">Be the very first player to conquer puzzles and step onto the gold podium!</p>
      </div>
    `;
    wwRankedList.innerHTML = '';
    return;
  }

  const p1 = rows[0] || null;
  const p2 = rows[1] || null;
  const p3 = rows[2] || null;

  const renderPodiumStep = (player, rank, crownEmoji, pedestalClass, heightStyle) => {
    if (!player) {
      return `
        <div class="ww-podium-step">
          <div class="ww-podium-avatar" style="border-color: rgba(255,255,255,0.1); color: #64748b;">
            👤
          </div>
          <div class="ww-podium-name" style="color: #64748b;">Open</div>
          <div class="ww-podium-score" style="color: #64748b; font-size: 0.8rem;">—</div>
          <div class="ww-podium-pedestal ${pedestalClass}" style="${heightStyle}; opacity: 0.4;">
            <span>#${rank}</span>
          </div>
        </div>
      `;
    }

    const isMe = currentUser && (player.user_id === currentUser.id || player.username === currentUser.username);
    const scoreVal = player.total_score ?? player.score ?? player.points ?? 0;
    const displayName = player.display_name || player.username;
    const initial = (displayName[0] || 'P').toUpperCase();
    const frameBorder = rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : '#d97706';

    return `
      <div class="ww-podium-step">
        <div class="ww-podium-avatar leaderboard-player-link" data-username="${player.username}" style="border-color: ${frameBorder}; cursor: pointer;">
          <span class="ww-crown-icon">${crownEmoji}</span>
          <span>${initial}</span>
        </div>
        <div class="ww-podium-name leaderboard-player-link" data-username="${player.username}" style="cursor: pointer;" title="${displayName}">
          ${displayName} ${isMe ? '⭐' : ''}
        </div>
        <div class="ww-podium-score">${scoreVal}</div>
        <div class="ww-podium-pedestal ${pedestalClass}" style="${heightStyle}">
          <span>#${rank}</span>
        </div>
      </div>
    `;
  };

  // Image 3 Podium order: Rank 2 on Left, Rank 1 in Center (tallest), Rank 3 on Right
  wwPodiumContainer.innerHTML = `
    ${renderPodiumStep(p2, 2, '🥈', 'ww-pedestal-2', 'height: 76px;')}
    ${renderPodiumStep(p1, 1, '👑', 'ww-pedestal-1', 'height: 104px;')}
    ${renderPodiumStep(p3, 3, '🥉', 'ww-pedestal-3', 'height: 60px;')}
  `;

  // Render Image 3 Ranked Cards (#4+)
  const restRows = rows.slice(3);
  if (restRows.length === 0) {
    wwRankedList.innerHTML = `<div style="text-align: center; color: #64748b; font-size: 0.8rem; padding: 1rem;">All active contenders are currently on the top 3 podium!</div>`;
  } else {
    wwRankedList.innerHTML = restRows.map((r, idx) => {
      const rankNum = idx + 4;
      const isMe = currentUser && (r.user_id === currentUser.id || r.username === currentUser.username);
      const scoreVal = r.total_score ?? r.score ?? r.points ?? 0;
      const attendedCount = r.plays_count ?? r.games_played ?? 0;
      const displayName = r.display_name || r.username;
      const initial = (displayName[0] || 'P').toUpperCase();
      const titlePill = r.selected_title ? `<span class="player-custom-title" style="font-size:0.65rem; margin-left:4px;">${formatTitleName(r.selected_title)}</span>` : '';

      return `
        <div class="ww-ranked-item ${isMe ? 'leaderboard-row-me' : ''}">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="ww-rank-badge">${rankNum}</div>
            <div style="width: 34px; height: 34px; border-radius: 50%; background: #334155; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; color: #cbd5e1; border: 1.5px solid rgba(255,255,255,0.15);">
              ${initial}
            </div>
            <div>
              <strong class="leaderboard-player-link" data-username="${r.username}" style="cursor: pointer; font-size: 0.92rem; color: #ffffff;">
                ${displayName}
              </strong>
              ${titlePill}
              ${isMe ? `<span class="you-badge" style="margin-left: 4px;">You</span>` : ''}
            </div>
          </div>
          <div style="text-align: right; display: flex; flex-direction: column; gap: 2px;">
            <div style="font-size: 0.82rem; color: #cbd5e1;">
              Rating: <strong style="color: #fbbf24; font-size: 0.95rem;">${scoreVal}</strong>
            </div>
            <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">
              Attended: <strong style="color: #e2e8f0;">${attendedCount}</strong>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Attach profile click listeners
  wwPodiumContainer.querySelectorAll('.leaderboard-player-link').forEach(el => {
    el.addEventListener('click', () => openPublicProfile(el.dataset.username));
  });
  wwRankedList.querySelectorAll('.leaderboard-player-link').forEach(el => {
    el.addEventListener('click', () => openPublicProfile(el.dataset.username));
  });
}

function renderWorldWarsTournaments(data) {
  if (!wwCurrentTournamentBanner || !wwContestsList) return;

  const currentWeek = data.currentWeekId || '2026-W44';
  const weekNumber = currentWeek.includes('-W') ? currentWeek.split('-W')[1] : '44';
  const contestNumber = 500 + parseInt(weekNumber, 10);

  // 1. Pinned Active Tournament Header (Updated daily with user's tournament score and rank)
  const myTournament = (data.weeklyTournament || []).find(r => 
    currentUser && (r.user_id === currentUser.id || r.username === currentUser.username)
  );
  const myRankIdx = myTournament ? (data.weeklyTournament || []).indexOf(myTournament) + 1 : null;
  const myPoints = myTournament ? myTournament.points : 0;
  const myGamesPlayed = myTournament ? myTournament.games_played : 0;

  wwCurrentTournamentBanner.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #fbbf24; font-weight: 800;">
          Current Active Championship
        </div>
        <h4 style="margin: 0.2rem 0; font-size: 1.25rem; font-weight: 900; color: #ffffff;">
          ⚔️ Season ${currentWeek} · Weekly Contest #${contestNumber}
        </h4>
        <div style="font-size: 0.78rem; color: #94a3b8; font-weight: 600;">
          Daily Standings Updated Every 24h · Resets Every Sunday 23:59 UTC
        </div>
      </div>
      <div class="badge" style="background:#064e3b; color:#34d399; border-color:#059669; font-weight:800; font-size:0.75rem; padding: 4px 10px;">
        Live Scoring ⚡
      </div>
    </div>

    <div style="display: flex; gap: 0.65rem; margin: 0.75rem 0;">
      <div style="flex:1; background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:0.55rem; text-align:center;">
        <div style="font-size:0.72rem; color:#94a3b8; font-weight:700;">Your Points</div>
        <div style="font-size:1.15rem; font-weight:900; color:#fbbf24;">${myPoints} pts</div>
      </div>
      <div style="flex:1; background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:0.55rem; text-align:center;">
        <div style="font-size:0.72rem; color:#94a3b8; font-weight:700;">Your Rank</div>
        <div style="font-size:1.15rem; font-weight:900; color:#38bdf8;">${myRankIdx ? `#${myRankIdx}` : 'Unranked'}</div>
      </div>
      <div style="flex:1; background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:0.55rem; text-align:center;">
        <div style="font-size:0.72rem; color:#94a3b8; font-weight:700;">Played</div>
        <div style="font-size:1.15rem; font-weight:900; color:#ffffff;">${myGamesPlayed}</div>
      </div>
    </div>

    <button type="button" id="btn-ww-play-tournament" class="btn-enter-world-wars" style="margin-top: 0.4rem; padding: 0.65rem 1rem; font-size: 0.9rem;">
      Play Today's Tournament Puzzles 🎯
    </button>
  `;

  document.getElementById('btn-ww-play-tournament')?.addEventListener('click', () => {
    worldWarsModal?.classList.add('hidden');
    gamesScrollList?.scrollIntoView({ behavior: 'smooth' });
  });

  // 2. Image 4 Contest Cards (Active, Biweekly, and Past Archives)
  const contests = [
    {
      id: 'weekly-current',
      title: `Weekly Contest ${contestNumber}`,
      date: 'Sun, Ongoing · Ends 23:59 UTC',
      type: 'weekly',
      thumbClass: 'ww-thumb-weekly',
      icon: '🧊',
      progress: `${todayCompletions.size} / 6`,
      isProgressActive: todayCompletions.size >= 3,
      btnLabel: 'Virtual',
      btnAction: 'play',
    },
    {
      id: 'biweekly-current',
      title: `Biweekly Contest ${contestNumber - 331}`,
      date: 'Sat, 20:00 UTC · Sprint Arena',
      type: 'biweekly',
      thumbClass: 'ww-thumb-biweekly',
      icon: '🎲',
      progress: '3 / 4',
      isProgressActive: false,
      btnLabel: 'Virtual',
      btnAction: 'play',
    },
    {
      id: 'weekly-prev',
      title: `Weekly Contest ${contestNumber - 1}`,
      date: 'Completed · Official Archives',
      type: 'weekly',
      thumbClass: 'ww-thumb-weekly',
      icon: '🧊',
      progress: '4 / 4',
      isProgressActive: true,
      btnLabel: 'Virtual',
      btnAction: 'archive',
    },
    {
      id: 'biweekly-prev',
      title: `Biweekly Contest ${contestNumber - 332}`,
      date: 'Completed · Official Archives',
      type: 'biweekly',
      thumbClass: 'ww-thumb-biweekly',
      icon: '🎲',
      progress: '0 / 4',
      isProgressActive: false,
      btnLabel: 'Virtual',
      btnAction: 'archive',
    },
  ];

  wwContestsList.innerHTML = contests.map(c => `
    <div class="ww-contest-card">
      <div class="ww-contest-info">
        <div class="ww-contest-thumb ${c.thumbClass}">
          <span>${c.icon}</span>
        </div>
        <div class="ww-contest-details">
          <div class="ww-contest-title">${c.title}</div>
          <div class="ww-contest-meta">${c.date}</div>
        </div>
      </div>
      <div class="ww-contest-actions">
        <div class="ww-contest-pill ${c.isProgressActive ? 'active' : 'inactive'}">
          ${c.progress}
        </div>
        <button type="button" class="ww-contest-btn" data-action="${c.btnAction}" data-title="${c.title}">
          ${c.btnLabel}
        </button>
      </div>
    </div>
  `).join('');

  wwContestsList.querySelectorAll('.ww-contest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const title = btn.dataset.title;
      if (action === 'play') {
        worldWarsModal?.classList.add('hidden');
        gamesScrollList?.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert(`📜 ${title}\n\nArchive standings are recorded in season records. Conquer live tournament puzzles to climb this week's hall of fame!`);
      }
    });
  });
}

// =========================================================================
// 12. PWA INSTALL APP SYSTEM (Requirement 3 & 14)
// =========================================================================

let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  if (pwaInstallMsg) {
    pwaInstallMsg.textContent = '🎉 Gamify app installed successfully!';
    pwaInstallMsg.style.display = 'block';
    pwaInstallMsg.style.background = '#dcfce7';
    pwaInstallMsg.style.color = '#15803d';
  }
});

async function triggerInstallApp() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      if (pwaInstallMsg) {
        pwaInstallMsg.textContent = '🎉 Installing Gamify app...';
        pwaInstallMsg.style.display = 'block';
        pwaInstallMsg.style.background = '#dcfce7';
        pwaInstallMsg.style.color = '#15803d';
      }
    }
    deferredInstallPrompt = null;
  } else {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      alert('Gamify is already installed on your device!');
    } else {
      alert('To install Gamify:\n\n• On Chrome/Android: Tap (⋮) and select "Install app".\n• On iPhone/Safari: Tap Share (⎋) and select "Add to Home Screen".');
    }
  }
}

btnNavInstallApp?.addEventListener('click', triggerInstallApp);
btnNavInstallAppLoggedOut?.addEventListener('click', triggerInstallApp);
btnAddToHome?.addEventListener('click', triggerInstallApp);
btnProfileInstallApp?.addEventListener('click', triggerInstallApp);

// =========================================================================
// 13. SERVICE WORKER REGISTRATION
// =========================================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.update().catch(() => {});
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    }).catch((err) => {
      console.log('SW registration note:', err);
    });
  });
}

// =========================================================================
// 14. INITIAL BOOTSTRAP (Instant Offline Restore -> Single Batched Sync)
// =========================================================================

async function bootstrap() {
  setupPinInputs();
  updateAuthUI();
  renderGamesScrollList();

  // 1. Instant 0ms Offline Restore from IndexedDB
  await restoreOfflineState();

  // 2. Single Batched Roundtrip to /api/me
  try {
    await fetchUserProfile();
  } catch (err) {
    console.warn('Profile bootstrap note:', err);
  }

  // 3. Pre-load World Wars Arena stats
  loadWorldWarsData('all').catch(() => {});
}

bootstrap();
