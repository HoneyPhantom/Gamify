/**
 * Static Game Loader & Lazy Dynamic Registry
 * 
 * Leverages Vite's static asset analyzer (import.meta.glob) to discover and load
 * modular puzzle games on-demand when clicked, keeping initial bundle size minimal.
 */

// Lazy imports all game modules matching the pattern without bundling upfront
const gameModules = import.meta.glob(['./*.js', '!./index.*', '!./prng.*']);
const loadedConfigs = new Map();

/**
 * Static games metadata catalog for instant card rendering without downloading module JS.
 */
const GAMES_CATALOG = [
  {
    id: 'wordle',
    slug: 'word-guess',
    title: 'Word Guess',
    description: 'Deduce the secret 5-letter mystery word within 6 strategic guesses.',
    badge: 'Free to Play',
    icon: '🔤',
    thumbnail: '/images/word-guess.png',
    isFree: true,
    gameUnlockCost: 0,
    difficulties: [
      { tier: 'easy', unlockCost: 0, rewardCoins: 15 },
      { tier: 'medium', unlockCost: 150, rewardCoins: 35 },
      { tier: 'hard', unlockCost: 300, rewardCoins: 75 },
    ],
    unlimitedPlayground: { unlockCost: 500 },
  },
  {
    id: 'number-grid',
    slug: 'number-grid',
    title: 'Number Grid',
    description: 'Deduce missing numbers to balance row & column target sums.',
    badge: '100 Coins to Unlock',
    icon: '🔢',
    thumbnail: '/images/number-grid.png',
    isFree: false,
    gameUnlockCost: 100,
    difficulties: [
      { tier: 'easy', unlockCost: 50, rewardCoins: 15 },
      { tier: 'medium', unlockCost: 150, rewardCoins: 35 },
      { tier: 'hard', unlockCost: 300, rewardCoins: 75 },
    ],
    unlimitedPlayground: { unlockCost: 500 },
  },
  {
    id: 'number-trail',
    slug: 'number-trail',
    title: 'Number Trail',
    description: 'Connect numbers in sequence with one continuous path visiting every cell.',
    badge: '150 Coins to Unlock',
    icon: '〰️',
    thumbnail: '/images/number-trail.png',
    isFree: false,
    gameUnlockCost: 150,
    difficulties: [
      { tier: 'easy', unlockCost: 50, rewardCoins: 15 },
      { tier: 'medium', unlockCost: 150, rewardCoins: 35 },
      { tier: 'hard', unlockCost: 300, rewardCoins: 75 },
    ],
    unlimitedPlayground: { unlockCost: 500 },
  },
  {
    id: 'sudoku',
    slug: 'sudoku',
    title: 'Classic Sudoku',
    description: 'Fill the grid with digits so every row, col, and subgrid has unique numbers.',
    badge: '150 Coins to Unlock',
    icon: '🔢',
    thumbnail: '/images/sudoku.png',
    isFree: false,
    gameUnlockCost: 150,
    difficulties: [
      { tier: 'easy', unlockCost: 0, rewardCoins: 15 },
      { tier: 'medium', unlockCost: 150, rewardCoins: 35 },
      { tier: 'hard', unlockCost: 300, rewardCoins: 75 },
    ],
    unlimitedPlayground: { unlockCost: 500 },
  },
  {
    id: 'memory-match',
    slug: 'memory-match',
    title: 'Memory Match',
    description: 'Flip cards and match all emoji pairs with fewest moves and fastest time!',
    badge: '150 Coins to Unlock',
    icon: '🃏',
    thumbnail: '/images/memory-match.png',
    isFree: false,
    gameUnlockCost: 150,
    difficulties: [
      { tier: 'easy', unlockCost: 0, rewardCoins: 15 },
      { tier: 'medium', unlockCost: 150, rewardCoins: 35 },
      { tier: 'hard', unlockCost: 300, rewardCoins: 75 },
    ],
    unlimitedPlayground: { unlockCost: 500 },
    infiniteMode: { unlockCost: 250 },
  },
  {
    id: 'crossword',
    slug: 'crossword',
    title: 'Daily Crossword',
    description: 'Solve the daily 5x5 mini crossword with intersecting Across & Down clues!',
    badge: '150 Coins to Unlock',
    icon: '📝',
    thumbnail: '/images/crossword.png',
    isFree: false,
    gameUnlockCost: 150,
    difficulties: [
      { tier: 'easy', unlockCost: 0, rewardCoins: 15 },
      { tier: 'medium', unlockCost: 150, rewardCoins: 35 },
      { tier: 'hard', unlockCost: 300, rewardCoins: 75 },
    ],
    unlimitedPlayground: { unlockCost: 250 },
    infiniteMode: { unlockCost: 250 },
  },
];

/**
 * Returns today's calendar date in UTC YYYY-MM-DD
 */
export function getTodayDateStr() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns yesterday's calendar date in UTC YYYY-MM-DD
 */
export function getYesterdayDateStr() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns all discovered games with their static metadata (cost, tiers, description)
 */
export function getAllGames() {
  return GAMES_CATALOG;
}

/**
 * Resolves a game from either its internal id or its public SEO slug
 */
export function getGameBySlugOrId(identifier) {
  if (!identifier) return null;
  const clean = String(identifier).toLowerCase().replace(/^\/games\//, '').replace(/\/$/, '');
  return GAMES_CATALOG.find(g => g.id === clean || g.slug === clean) || null;
}

/**
 * Dynamically loads a game module when needed
 */
export async function loadGameConfig(gameId) {
  if (loadedConfigs.has(gameId)) {
    return loadedConfigs.get(gameId);
  }

  // Fast path: find matching file by key name
  for (const [path, loader] of Object.entries(gameModules)) {
    if (path.includes(gameId)) {
      const mod = await loader();
      const config = mod.gameConfig || mod.default;
      if (config) {
        loadedConfigs.set(gameId, config);
        return config;
      }
    }
  }

  // Fallback: try all loaders
  for (const [path, loader] of Object.entries(gameModules)) {
    const mod = await loader();
    const config = mod.gameConfig || mod.default;
    if (config && config.id) {
      loadedConfigs.set(config.id, config);
      if (config.id === gameId) return config;
    }
  }

  throw new Error(`Game module for '${gameId}' not found.`);
}

/**
 * Retrieves cached game configuration or null if not loaded yet
 */
export function getGameConfig(gameId) {
  return loadedConfigs.get(gameId) || null;
}

/**
 * Generates the deterministic daily puzzle client-side with 0 network latency.
 */
export async function getDailyPuzzle(gameId, difficulty, dateStr = getTodayDateStr()) {
  const game = await loadGameConfig(gameId);
  const diffConfig = game.difficulties[difficulty];

  if (!diffConfig) {
    throw new Error(`Difficulty '${difficulty}' does not exist for game '${gameId}'.`);
  }

  return diffConfig.generateDailyPuzzle(dateStr);
}

/**
 * Generates a non-daily, endless random puzzle for infinite mode.
 */
export async function getPlaygroundPuzzle(gameId, tier = 'medium', ...args) {
  const game = await loadGameConfig(gameId);
  if (game.unlimitedPlayground) {
    const fn = game.unlimitedPlayground.generatePlaygroundPuzzle || game.unlimitedPlayground.generateRandomPuzzle;
    if (typeof fn === 'function') {
      return fn(tier, ...args);
    }
  }
  // Fallback: generate using random seed with tier generator
  if (game.difficulties && game.difficulties[tier]) {
    const randomDate = `infinite-${Date.now()}-${Math.random()}`;
    return game.difficulties[tier].generateDailyPuzzle(randomDate);
  }
  throw new Error(`Game '${gameId}' does not support infinite mode.`);
}

export const getInfinitePuzzle = getPlaygroundPuzzle;

export default {
  getAllGames,
  getGameBySlugOrId,
  loadGameConfig,
  getGameConfig,
  getDailyPuzzle,
  getPlaygroundPuzzle,
  getInfinitePuzzle,
  getTodayDateStr,
  getYesterdayDateStr,
};
