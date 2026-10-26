import { Env, AuthenticatedUser } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';

export async function handleCreateChallenge(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: {
    toUsername?: string;
    gameId?: string;
    difficulty?: string;
    targetScore?: number;
    challengerTimeMs?: number;
  };

  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const { toUsername, gameId, difficulty } = body;
  if (!toUsername || !gameId || !difficulty) {
    return errorResponse("Missing required fields: 'toUsername', 'gameId', 'difficulty'", 400);
  }

  const cleanToUsername = toUsername.trim().toLowerCase();
  if (cleanToUsername === user.username.toLowerCase()) {
    return errorResponse("You cannot challenge yourself!", 400);
  }

  const opponent = await env.DB.prepare(
    'SELECT id, username, display_name FROM users WHERE LOWER(username) = ?'
  ).bind(cleanToUsername).first<{ id: string; username: string; display_name: string }>();

  if (!opponent) {
    return errorResponse(`Player '@${toUsername}' not found`, 404);
  }

  // Determine target score if not provided
  let targetScore = body.targetScore;
  let challengerTimeMs = body.challengerTimeMs || 45000;

  if (typeof targetScore !== 'number' || targetScore <= 0) {
    const stats = await env.DB.prepare(
      'SELECT best_score FROM user_game_stats WHERE user_id = ? AND game_id = ?'
    ).bind(user.id, gameId).first<{ best_score: number }>();

    targetScore = stats?.best_score && stats.best_score > 0 ? stats.best_score : 500;
  }

  const challengeId = `ch_${crypto.randomUUID()}`;

  await env.DB.prepare(`
    INSERT INTO user_challenges (
      id, from_user_id, to_user_id, game_id, difficulty, target_score, challenger_time_ms, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
  `).bind(challengeId, user.id, opponent.id, gameId, difficulty, targetScore, challengerTimeMs).run();

  return jsonResponse({
    success: true,
    message: `Challenge sent to @${opponent.username}!`,
    challenge: {
      id: challengeId,
      toUsername: opponent.username,
      opponentDisplayName: opponent.display_name || opponent.username,
      gameId,
      difficulty,
      targetScore,
      challengerTimeMs,
    },
  }, 201);
}

export async function handleGetChallenges(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  const [incomingResult, sentResult] = await Promise.all([
    // Challenges sent TO current user
    env.DB.prepare(`
      SELECT 
        c.id,
        c.from_user_id,
        c.to_user_id,
        c.game_id,
        c.difficulty,
        c.target_score,
        c.challenger_time_ms,
        c.status,
        c.opponent_score,
        c.opponent_time_ms,
        c.winner_user_id,
        c.created_at,
        c.completed_at,
        u.username AS challenger_username,
        COALESCE(u.display_name, u.username) AS challenger_display_name,
        COALESCE(u.selected_frame, 'default') AS challenger_frame,
        COALESCE(u.selected_title, '') AS challenger_title
      FROM user_challenges c
      JOIN users u ON c.from_user_id = u.id
      WHERE c.to_user_id = ?
      ORDER BY c.created_at DESC
      LIMIT 25
    `).bind(user.id).all(),

    // Challenges sent BY current user
    env.DB.prepare(`
      SELECT 
        c.id,
        c.from_user_id,
        c.to_user_id,
        c.game_id,
        c.difficulty,
        c.target_score,
        c.challenger_time_ms,
        c.status,
        c.opponent_score,
        c.opponent_time_ms,
        c.winner_user_id,
        c.created_at,
        c.completed_at,
        u.username AS opponent_username,
        COALESCE(u.display_name, u.username) AS opponent_display_name,
        COALESCE(u.selected_frame, 'default') AS opponent_frame,
        COALESCE(u.selected_title, '') AS opponent_title
      FROM user_challenges c
      JOIN users u ON c.to_user_id = u.id
      WHERE c.from_user_id = ?
      ORDER BY c.created_at DESC
      LIMIT 25
    `).bind(user.id).all(),
  ]);

  const incomingAll = incomingResult.results || [];
  const pendingIncoming = incomingAll.filter((c: any) => c.status === 'pending');
  const completedIncoming = incomingAll.filter((c: any) => c.status === 'completed');

  return jsonResponse({
    success: true,
    incoming: incomingAll,
    pendingCount: pendingIncoming.length,
    pendingIncoming,
    completedIncoming,
    sent: sentResult.results || [],
  });
}

export async function handleRespondChallenge(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: {
    challengeId?: string;
    action?: 'decline' | 'complete';
    score?: number;
    timeTakenMs?: number;
  };

  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON payload', 400);
  }

  const { challengeId, action } = body;
  if (!challengeId || !action) {
    return errorResponse("Missing required fields 'challengeId' and 'action'", 400);
  }

  const challenge = await env.DB.prepare(`
    SELECT * FROM user_challenges WHERE id = ?
  `).bind(challengeId).first<any>();

  if (!challenge) {
    return errorResponse('Challenge not found', 404);
  }

  if (challenge.to_user_id !== user.id) {
    return errorResponse('Unauthorized: You are not the recipient of this challenge', 403);
  }

  if (challenge.status !== 'pending') {
    return errorResponse(`Challenge has already been ${challenge.status}`, 400);
  }

  if (action === 'decline') {
    await env.DB.prepare(`
      UPDATE user_challenges 
      SET status = 'declined', completed_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(challengeId).run();

    return jsonResponse({
      success: true,
      message: 'Challenge declined',
    });
  }

  if (action === 'complete') {
    const opponentScore = typeof body.score === 'number' ? body.score : 0;
    const opponentTimeMs = typeof body.timeTakenMs === 'number' ? body.timeTakenMs : 60000;

    let winnerId: string;
    if (opponentScore > challenge.target_score) {
      winnerId = user.id; // Recipient beat the target!
    } else if (opponentScore < challenge.target_score) {
      winnerId = challenge.from_user_id; // Challenger held their ground!
    } else {
      // Tie-breaker: faster time wins
      winnerId = opponentTimeMs <= challenge.challenger_time_ms ? user.id : challenge.from_user_id;
    }

    const BONUS_COINS = 35;
    const BONUS_XP = 50;

    // Update challenge and award bonus to winner
    await env.DB.batch([
      env.DB.prepare(`
        UPDATE user_challenges 
        SET 
          status = 'completed',
          opponent_score = ?,
          opponent_time_ms = ?,
          winner_user_id = ?,
          completed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(opponentScore, opponentTimeMs, winnerId, challengeId),

      env.DB.prepare(`
        UPDATE users 
        SET 
          coins = coins + ?,
          xp = xp + ?,
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).bind(BONUS_COINS, BONUS_XP, winnerId),
    ]);

    const isWinner = winnerId === user.id;

    return jsonResponse({
      success: true,
      challengeId,
      isWinner,
      winnerUserId: winnerId,
      opponentScore,
      targetScore: challenge.target_score,
      bonusCoins: BONUS_COINS,
      bonusXp: BONUS_XP,
      message: isWinner 
        ? `🏆 Victory! You beat the challenge with ${opponentScore} Pts! +${BONUS_COINS} Coins & +${BONUS_XP} XP earned!`
        : `Defeat! You scored ${opponentScore} Pts vs target ${challenge.target_score} Pts. Better luck next time!`,
    });
  }

  return errorResponse(`Invalid action '${action}'`, 400);
}
