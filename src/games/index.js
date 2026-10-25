/**
 * Static Game Loader & Client-Side Registry
 * 
 * Leverages Vite's static asset analyzer (import.meta.glob) to discover and bundle
 * all modular puzzle games at build time with zero server overhead.
 */

// Eagerly imports all game modules matching the pattern in the current folder,
// excluding index.js and prng.js
const gameModules = import.meta.glob(['./*.js', './*.ts', '!./index.*', '!./prng.*'], {
  eager: true
});

/**
 * Registry Map: gameId -> gameConfig
 */
const registry = new Map();

for (const [path, module] of Object.entries(gameModules)) {
  const config = module.gameConfig || module.default;
  if (!config || !config.id) {
    console.warn(`[GameLoader] Skipping module at ${path}: missing 'gameConfig' or 'id' export.`);
    continue;
  }
  
  // Validate schema completeness
  if (!config.difficulties || !config.unlimitedPlayground) {
    console.warn(`[GameLoader] Module ${config.id} does not conform strictly to Modular Game Spec.`);
  }

  registry.set(config.id, config);
}

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
 * Returns all discovered games with their static metadata (cost, tiers, description)
 */
export function getAllGames() {
  return Array.from(registry.values()).map(game => ({
    id: game.id,
    title: game.title,
    description: game.description || "",
    badge: game.badge || "Daily Puzzle",
    icon: game.icon || "🎮",
    thumbnail: game.thumbnail || null,
    isFree: game.isFree ?? true,
    gameUnlockCost: game.gameUnlockCost || 0,
    difficulties: Object.keys(game.difficulties).map(tier => ({
      tier,
      unlockCost: game.difficulties[tier].unlockCost,
      rewardCoins: game.difficulties[tier].rewardCoins || 0
    })),
    unlimitedPlayground: {
      unlockCost: game.unlimitedPlayground.unlockCost
    }
  }));
}

/**
 * Retrieves the full game configuration for a given game ID
 */
export function getGameConfig(gameId) {
  const game = registry.get(gameId);
  if (!game) {
    throw new Error(`Game '${gameId}' not found in static registry.`);
  }
  return game;
}

/**
 * Generates the deterministic daily puzzle client-side with 0 network latency.
 * 
 * @param {string} gameId - e.g., 'number-grid'
 * @param {'easy'|'medium'|'hard'} difficulty 
 * @param {string} [dateStr] - Optional date seed, defaults to current UTC date
 */
export function getDailyPuzzle(gameId, difficulty, dateStr = getTodayDateStr()) {
  const game = getGameConfig(gameId);
  const diffConfig = game.difficulties[difficulty];

  if (!diffConfig) {
    throw new Error(`Difficulty '${difficulty}' does not exist for game '${gameId}'.`);
  }

  return diffConfig.generateDailyPuzzle(dateStr);
}

/**
 * Generates a non-daily, endless random puzzle for playground mode.
 * 
 * @param {string} gameId 
 * @param  {...any} args 
 */
export function getPlaygroundPuzzle(gameId, ...args) {
  const game = getGameConfig(gameId);
  if (!game.unlimitedPlayground || typeof game.unlimitedPlayground.generateRandomPuzzle !== 'function') {
    throw new Error(`Game '${gameId}' does not support unlimited playground mode.`);
  }
  return game.unlimitedPlayground.generateRandomPuzzle(...args);
}

export default {
  getAllGames,
  getGameConfig,
  getDailyPuzzle,
  getPlaygroundPuzzle,
  getTodayDateStr
};
