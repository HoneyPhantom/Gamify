import { Env, AuthenticatedUser, UnlockRequestBody, UserRow, UserGameUnlockRow } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';

// Costs in coins
export const GAME_UNLOCK_COSTS: Record<string, number> = {
  'wordle': 0,         // Free to play
  'number-grid': 100,  // Locked base game: 100 coins
  'number-trail': 150, // Locked base game: 150 coins
  'sudoku': 150,       // Locked base game: 150 coins
  'memory-match': 150, // Locked base game: 150 coins
  'crossword': 150,    // Locked base game: 150 coins
};

export const TIER_COSTS: Record<string, number> = {
  easy: 50,
  medium: 150,
  hard: 300,
  playground: 250,
  infinite: 250,
  infinite_mode: 250,
};

export async function handleUnlock(request: Request, env: Env, user: AuthenticatedUser): Promise<Response> {
  let body: UnlockRequestBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body in unlock request', 400);
  }

  const rawGameId = body.gameId;
  const gameId = rawGameId === 'word-guess' ? 'wordle' : rawGameId;
  const { tier } = body;
  if (!gameId || !tier) {
    return errorResponse("Missing required fields 'gameId' and 'tier'", 400);
  }

  // 1. Fetch or initialize the user's unlock record for this game
  let unlockRecord = await env.DB.prepare(
    'SELECT * FROM user_game_unlocks WHERE user_id = ? AND game_id = ?'
  ).bind(user.id, gameId).first<UserGameUnlockRow>();

  if (!unlockRecord) {
    const isFreeGame = gameId === 'wordle';
    const id = `${user.id}#${gameId}`;
    await env.DB.prepare(`
      INSERT INTO user_game_unlocks (id, user_id, game_id, game_unlocked, easy_unlocked, medium_unlocked, hard_unlocked, playground_unlocked)
      VALUES (?, ?, ?, ?, ?, 0, 0, 0)
    `).bind(id, user.id, gameId, isFreeGame ? 1 : 0, isFreeGame ? 1 : 0).run();

    unlockRecord = {
      id,
      user_id: user.id,
      game_id: gameId,
      game_unlocked: isFreeGame ? 1 : 0,
      easy_unlocked: isFreeGame ? 1 : 0,
      medium_unlocked: 0,
      hard_unlocked: 0,
      playground_unlocked: 0,
      unlocked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  // -------------------------------------------------------------------------
  // ACTION A: UNLOCK ENTIRE GAME (e.g. number-grid for 100 coins)
  // -------------------------------------------------------------------------
  if (tier === 'game') {
    if (unlockRecord.game_unlocked === 1) {
      return jsonResponse({
        success: true,
        message: `${gameId} is already unlocked!`,
        alreadyUnlocked: true,
        unlocks: unlockRecord,
      });
    }

    const gameCost = GAME_UNLOCK_COSTS[gameId] ?? 100;

    // Check user balance
    const userRow = await env.DB.prepare('SELECT coins FROM users WHERE id = ?').bind(user.id).first<Pick<UserRow, 'coins'>>();
    if (!userRow || userRow.coins < gameCost) {
      return errorResponse(
        `Insufficient coins to unlock ${gameId}. Required: ${gameCost} coins, Available: ${userRow?.coins ?? 0} coins.`,
        400,
        { required: gameCost, available: userRow?.coins ?? 0 }
      );
    }

    // Atomically deduct coins and unlock game + easy tier
    const batchRes = await env.DB.batch([
      env.DB.prepare('UPDATE users SET coins = coins - ?, updated_at = DATETIME(\'now\') WHERE id = ? AND coins >= ?')
        .bind(gameCost, user.id, gameCost),
      env.DB.prepare('UPDATE user_game_unlocks SET game_unlocked = 1, easy_unlocked = 1, updated_at = DATETIME(\'now\') WHERE user_id = ? AND game_id = ?')
        .bind(user.id, gameId),
    ]);

    if (!batchRes[0].meta.changes || batchRes[0].meta.changes === 0) {
      return errorResponse('Transaction conflict or insufficient coins during deduction', 409);
    }

    const [updatedUser, updatedUnlocks] = await Promise.all([
      env.DB.prepare('SELECT coins FROM users WHERE id = ?').bind(user.id).first<{ coins: number }>(),
      env.DB.prepare('SELECT * FROM user_game_unlocks WHERE user_id = ? AND game_id = ?').bind(user.id, gameId).first<UserGameUnlockRow>(),
    ]);

    return jsonResponse({
      success: true,
      message: `🎉 Successfully unlocked ${gameId}!`,
      unlockedGame: gameId,
      deductedCoins: gameCost,
      remainingCoins: updatedUser?.coins ?? 0,
      unlocks: updatedUnlocks,
    });
  }

  // -------------------------------------------------------------------------
  // ACTION B: UNLOCK SPECIFIC DIFFICULTY TIER (easy, medium, hard, playground)
  // -------------------------------------------------------------------------
  // First, verify game itself is unlocked!
  if (unlockRecord.game_unlocked !== 1) {
    return errorResponse(
      `Game '${gameId}' is locked! You must unlock the base game before unlocking difficulty tiers.`,
      403,
      { code: 'GAME_LOCKED', gameId, gameUnlockCost: GAME_UNLOCK_COSTS[gameId] ?? 100 }
    );
  }

  const cost = TIER_COSTS[tier];
  if (cost === undefined) {
    return errorResponse(`Invalid unlock tier '${tier}'. Allowed: game, easy, medium, hard, infinite, playground`, 400);
  }

  const columnMap: Record<string, keyof UserGameUnlockRow> = {
    easy: 'easy_unlocked',
    medium: 'medium_unlocked',
    hard: 'hard_unlocked',
    playground: 'playground_unlocked',
    infinite: 'playground_unlocked',
    infinite_mode: 'playground_unlocked',
  };

  const targetCol = columnMap[tier];
  if (unlockRecord[targetCol] === 1) {
    return jsonResponse({
      success: true,
      message: `${tier} is already unlocked for ${gameId}`,
      alreadyUnlocked: true,
      unlocks: unlockRecord,
    });
  }

  // Check user coin balance
  const userRow = await env.DB.prepare('SELECT coins FROM users WHERE id = ?').bind(user.id).first<Pick<UserRow, 'coins'>>();
  if (!userRow || userRow.coins < cost) {
    return errorResponse(
      `Insufficient coins balance. Required: ${cost} coins, Current: ${userRow?.coins ?? 0} coins.`,
      400,
      { required: cost, available: userRow?.coins ?? 0 }
    );
  }

  // Deduct coins and update tier flag atomically
  const batchResults = await env.DB.batch([
    env.DB.prepare('UPDATE users SET coins = coins - ?, updated_at = DATETIME(\'now\') WHERE id = ? AND coins >= ?')
      .bind(cost, user.id, cost),
    env.DB.prepare(`UPDATE user_game_unlocks SET ${targetCol} = 1, updated_at = DATETIME('now') WHERE user_id = ? AND game_id = ?`)
      .bind(user.id, gameId),
  ]);

  if (!batchResults[0].meta.changes || batchResults[0].meta.changes === 0) {
    return errorResponse('Transaction conflict or insufficient coins during deduction', 409);
  }

  const [updatedUser, updatedUnlocks] = await Promise.all([
    env.DB.prepare('SELECT coins FROM users WHERE id = ?').bind(user.id).first<{ coins: number }>(),
    env.DB.prepare('SELECT * FROM user_game_unlocks WHERE user_id = ? AND game_id = ?').bind(user.id, gameId).first<UserGameUnlockRow>(),
  ]);

  return jsonResponse({
    success: true,
    message: `Successfully unlocked ${tier} tier for ${gameId}!`,
    unlockedTier: tier,
    deductedCoins: cost,
    remainingCoins: updatedUser?.coins ?? 0,
    unlocks: updatedUnlocks,
  });
}
