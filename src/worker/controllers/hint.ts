import { Env, AuthenticatedUser } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';

export const HINT_COST = 10;

export async function handleUseHint(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: { gameId?: string };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const gameId = body.gameId || 'number-grid';

  // Check current coin balance
  const currentUser = await env.DB.prepare('SELECT coins FROM users WHERE id = ?')
    .bind(user.id).first<{ coins: number }>();

  if (!currentUser || currentUser.coins < HINT_COST) {
    return errorResponse(`Insufficient coins for hint. Hints cost ${HINT_COST} coins. You currently have ${currentUser?.coins ?? 0} coins.`, 400, {
      code: 'INSUFFICIENT_COINS',
      cost: HINT_COST,
      currentCoins: currentUser?.coins ?? 0,
    });
  }

  // Deduct coins atomically
  await env.DB.prepare(
    'UPDATE users SET coins = coins - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND coins >= ?'
  ).bind(HINT_COST, user.id, HINT_COST).run();

  const updatedUser = await env.DB.prepare('SELECT coins FROM users WHERE id = ?')
    .bind(user.id).first<{ coins: number }>();

  return jsonResponse({
    success: true,
    gameId,
    cost: HINT_COST,
    remainingCoins: updatedUser?.coins ?? (currentUser.coins - HINT_COST),
    message: `Hint purchased for ${HINT_COST} coins!`,
  });
}
