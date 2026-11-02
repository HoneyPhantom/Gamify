import { Env, AuthenticatedUser } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';

export const BASE_HINT_COST = 10;

/**
 * Calculates escalating hint cost per game attempt:
 * Hint 1 (index 0): 10 coins
 * Hint 2 (index 1): 25 coins
 * Hint 3 (index 2): 50 coins
 * Hint 4+ (index 3+): 100, 200, 400... up to max 1000 coins
 */
export function calculateHintCost(hintIndex: number = 0): number {
  const idx = Math.max(0, Math.floor(hintIndex));
  if (idx === 0) return 10;
  if (idx === 1) return 25;
  if (idx === 2) return 50;
  return Math.min(1000, Math.round(50 * Math.pow(2, idx - 2)));
}

export async function handleUseHint(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: { gameId?: string; hintIndex?: number };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const gameId = body.gameId || 'wordle';
  const hintIndex = typeof body.hintIndex === 'number' ? body.hintIndex : 0;
  const cost = calculateHintCost(hintIndex);
  const nextCost = calculateHintCost(hintIndex + 1);

  // Check current coin balance
  const currentUser = await env.DB.prepare('SELECT coins FROM users WHERE id = ?')
    .bind(user.id).first<{ coins: number }>();

  if (!currentUser || currentUser.coins < cost) {
    return errorResponse(`Insufficient coins for hint. This hint costs ${cost} coins. You currently have ${currentUser?.coins ?? 0} coins.`, 400, {
      code: 'INSUFFICIENT_COINS',
      cost,
      nextCost,
      currentCoins: currentUser?.coins ?? 0,
    });
  }

  // Deduct coins atomically
  await env.DB.prepare(
    'UPDATE users SET coins = coins - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND coins >= ?'
  ).bind(cost, user.id, cost).run();

  const updatedUser = await env.DB.prepare('SELECT coins FROM users WHERE id = ?')
    .bind(user.id).first<{ coins: number }>();

  return jsonResponse({
    success: true,
    gameId,
    hintIndex,
    cost,
    nextCost,
    remainingCoins: updatedUser?.coins ?? (currentUser.coins - cost),
    message: `Hint purchased for ${cost} coins!`,
  });
}
