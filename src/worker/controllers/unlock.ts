import { Env, AuthenticatedUser, UnlockRequestBody, UserRow, UserGameUnlockRow } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';

// Canonical tier costs
const TIER_COSTS: Record<string, number> = {
  easy: 50,
  medium: 150,
  hard: 300,
  playground: 500,
};

export async function handleUnlock(request: Request, env: Env, user: AuthenticatedUser): Promise<Response> {
  let body: UnlockRequestBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body in unlock request', 400);
  }

  const { gameId, tier } = body;
  if (!gameId || !tier) {
    return errorResponse("Missing required fields 'gameId' and 'tier'", 400);
  }

  const cost = TIER_COSTS[tier];
  if (cost === undefined) {
    return errorResponse(`Invalid unlock tier '${tier}'. Allowed: easy, medium, hard, playground`, 400);
  }

  // 1. Fetch or initialize the user's unlock record for this game
  let unlockRecord = await env.DB.prepare(
    'SELECT * FROM user_game_unlocks WHERE user_id = ? AND game_id = ?'
  ).bind(user.id, gameId).first<UserGameUnlockRow>();

  if (!unlockRecord) {
    const id = `${user.id}#${gameId}`;
    await env.DB.prepare(`
      INSERT INTO user_game_unlocks (id, user_id, game_id, easy_unlocked, medium_unlocked, hard_unlocked, playground_unlocked)
      VALUES (?, ?, ?, 1, 0, 0, 0)
    `).bind(id, user.id, gameId).run();

    unlockRecord = {
      id,
      user_id: user.id,
      game_id: gameId,
      easy_unlocked: 1,
      medium_unlocked: 0,
      hard_unlocked: 0,
      playground_unlocked: 0,
      unlocked_at: new Date().toISOString(),
    };
  }

  // Check if already unlocked
  const columnMap: Record<string, keyof UserGameUnlockRow> = {
    easy: 'easy_unlocked',
    medium: 'medium_unlocked',
    hard: 'hard_unlocked',
    playground: 'playground_unlocked',
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

  // -------------------------------------------------------------------------
  // CRUCIAL VALIDATION RULE:
  // If tier === 'playground', execute strict check against D1 verifying that
  // easy_unlocked, medium_unlocked, and hard_unlocked are ALL true (1).
  // -------------------------------------------------------------------------
  if (tier === 'playground') {
    const missingTiers: string[] = [];
    if (!unlockRecord.easy_unlocked) missingTiers.push('easy');
    if (!unlockRecord.medium_unlocked) missingTiers.push('medium');
    if (!unlockRecord.hard_unlocked) missingTiers.push('hard');

    if (missingTiers.length > 0) {
      return errorResponse(
        `Forbidden: Unlimited Playground requires conquering and unlocking all previous difficulty tiers first. Missing: ${missingTiers.join(', ')}.`,
        403,
        {
          code: 'PLAYGROUND_PREREQUISITES_NOT_MET',
          missingTiers,
          currentUnlocks: {
            easy: Boolean(unlockRecord.easy_unlocked),
            medium: Boolean(unlockRecord.medium_unlocked),
            hard: Boolean(unlockRecord.hard_unlocked),
          },
        }
      );
    }
  }

  // 2. Verify current user coin balance
  const userRow = await env.DB.prepare(
    'SELECT coins FROM users WHERE id = ?'
  ).bind(user.id).first<Pick<UserRow, 'coins'>>();

  if (!userRow || userRow.coins < cost) {
    return errorResponse(
      `Insufficient coins balance. Required: ${cost}, Current: ${userRow?.coins ?? 0}`,
      400,
      { required: cost, available: userRow?.coins ?? 0 }
    );
  }

  // 3. Atomically deduct coins and set unlock tier flag within a D1 batch transaction
  const deductCoinsStmt = env.DB.prepare(
    `UPDATE users 
     SET coins = coins - ?, updated_at = DATETIME('now') 
     WHERE id = ? AND coins >= ?`
  ).bind(cost, user.id, cost);

  const unlockTierStmt = env.DB.prepare(
    `UPDATE user_game_unlocks 
     SET ${targetCol} = 1, updated_at = DATETIME('now') 
     WHERE user_id = ? AND game_id = ?`
  ).bind(user.id, gameId);

  // Execute D1 atomic batch
  const batchResults = await env.DB.batch([deductCoinsStmt, unlockTierStmt]);

  // Ensure balance deduction actually modified a row
  if (!batchResults[0].meta.changes || batchResults[0].meta.changes === 0) {
    return errorResponse('Transaction conflict or insufficient coins during deduction', 409);
  }

  // Fetch updated balance and unlocks
  const [updatedUser, updatedUnlocks] = await Promise.all([
    env.DB.prepare('SELECT coins FROM users WHERE id = ?').bind(user.id).first<{ coins: number }>(),
    env.DB.prepare('SELECT * FROM user_game_unlocks WHERE user_id = ? AND game_id = ?').bind(user.id, gameId).first<UserGameUnlockRow>(),
  ]);

  return jsonResponse({
    success: true,
    message: `Successfully unlocked ${tier} tier for ${gameId}`,
    unlockedTier: tier,
    deductedCoins: cost,
    remainingCoins: updatedUser?.coins ?? 0,
    unlocks: updatedUnlocks,
  });
}
