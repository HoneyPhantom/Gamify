import { Env, AuthenticatedUser, SubmitScoreRequestBody, UserRow, UserGameUnlockRow } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';
import { getTodayUTC, calculateNextStreak } from '../utils/date';

const REWARD_COINS: Record<string, number> = {
  easy: 15,
  medium: 35,
  hard: 75,
  playground: 0, // Playground gives infinite practice, daily coins only for daily puzzles
};

export async function handleSubmitScore(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: SubmitScoreRequestBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body in submit score request', 400);
  }

  const { gameId, difficulty, score, timeTakenMs } = body;
  const playedDate = body.dateStr || getTodayUTC();

  // Basic sanity validation
  if (!gameId || !difficulty || typeof score !== 'number' || typeof timeTakenMs !== 'number') {
    return errorResponse('Missing or invalid fields: gameId, difficulty, score, timeTakenMs', 400);
  }

  if (score < 0 || score > 100000) {
    return errorResponse('Score out of plausible bounds', 400);
  }

  // Anti-cheat: human speed check (e.g. minimum 1.5 seconds)
  if (timeTakenMs < 1500) {
    return errorResponse('Completion time rejected: below physical human threshold', 422);
  }

  // 1. Verify user has unlocked the tier
  const unlocks = await env.DB.prepare(
    'SELECT * FROM user_game_unlocks WHERE user_id = ? AND game_id = ?'
  ).bind(user.id, gameId).first<UserGameUnlockRow>();

  const columnMap: Record<string, keyof UserGameUnlockRow> = {
    easy: 'easy_unlocked',
    medium: 'medium_unlocked',
    hard: 'hard_unlocked',
    playground: 'playground_unlocked',
  };

  const col = columnMap[difficulty];
  if (!col || (unlocks && unlocks[col] !== 1 && difficulty !== 'easy')) {
    return errorResponse(`Access denied: Tier '${difficulty}' is not unlocked for this user.`, 403);
  }

  // 2. Fetch current user state for streak & coins
  const currentUser = await env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(user.id).first<UserRow>();

  if (!currentUser) {
    return errorResponse('User profile not found', 404);
  }

  // 3. Check daily reward eligibility (Idempotency)
  let coinsToAward = 0;
  let isFirstDailyCompletion = false;
  let newStreak = currentUser.streak_count;

  if (difficulty !== 'playground') {
    const existingCompletion = await env.DB.prepare(`
      SELECT id FROM daily_completions 
      WHERE user_id = ? AND game_id = ? AND difficulty = ? AND played_date = ?
    `).bind(user.id, gameId, difficulty, playedDate).first<{ id: string }>();

    if (!existingCompletion) {
      isFirstDailyCompletion = true;
      coinsToAward = REWARD_COINS[difficulty] || 0;
      newStreak = calculateNextStreak(currentUser.last_played_date, currentUser.streak_count, playedDate);
    }
  }

  // 4. Prepare atomic batch statements
  const batchStatements: D1PreparedStatement[] = [];

  // A. Upsert User Game Running Aggregates (SUM and COUNT)
  batchStatements.push(
    env.DB.prepare(`
      INSERT INTO user_game_stats (user_id, game_id, total_score, plays_count, best_score, updated_at)
      VALUES (?, ?, ?, 1, ?, DATETIME('now'))
      ON CONFLICT(user_id, game_id) DO UPDATE SET
        total_score = user_game_stats.total_score + excluded.total_score,
        plays_count = user_game_stats.plays_count + 1,
        best_score = MAX(user_game_stats.best_score, excluded.best_score),
        updated_at = DATETIME('now')
    `).bind(user.id, gameId, score, score)
  );

  // B. If first daily completion, insert idempotency completion ledger & update user coins/streak
  if (isFirstDailyCompletion) {
    const completionId = `cmp_${user.id}_${gameId}_${difficulty}_${playedDate}`;
    batchStatements.push(
      env.DB.prepare(`
        INSERT INTO daily_completions (id, user_id, game_id, difficulty, played_date, coins_awarded, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'))
      `).bind(completionId, user.id, gameId, difficulty, playedDate, coinsToAward)
    );

    batchStatements.push(
      env.DB.prepare(`
        UPDATE users 
        SET coins = coins + ?, 
            streak_count = ?, 
            last_played_date = ?, 
            updated_at = DATETIME('now')
        WHERE id = ?
      `).bind(coinsToAward, newStreak, playedDate, user.id)
    );

    // C. Daily Leaderboard Entry (Only for competitive daily tiers)
    const leaderboardId = `lb_${gameId}_${difficulty}_${user.id}_${playedDate}`;
    batchStatements.push(
      env.DB.prepare(`
        INSERT INTO daily_leaderboard (id, game_id, difficulty, user_id, score, time_taken_ms, played_date, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
        ON CONFLICT(game_id, difficulty, user_id, played_date) DO UPDATE SET
          score = CASE WHEN excluded.score > daily_leaderboard.score THEN excluded.score ELSE daily_leaderboard.score END,
          time_taken_ms = CASE WHEN excluded.time_taken_ms < daily_leaderboard.time_taken_ms THEN excluded.time_taken_ms ELSE daily_leaderboard.time_taken_ms END
      `).bind(leaderboardId, gameId, difficulty, user.id, score, timeTakenMs, playedDate)
    );
  }

  // Execute all updates atomically
  await env.DB.batch(batchStatements);

  // Fetch updated aggregates
  const updatedStats = await env.DB.prepare(`
    SELECT total_score, plays_count, best_score, 
           ROUND(CAST(total_score AS REAL) / plays_count, 2) as average_score
    FROM user_game_stats 
    WHERE user_id = ? AND game_id = ?
  `).bind(user.id, gameId).first();

  return jsonResponse({
    success: true,
    scoreSubmitted: score,
    timeTakenMs,
    isFirstDailyCompletion,
    coinsAwarded: coinsToAward,
    currentCoins: currentUser.coins + coinsToAward,
    streakCount: newStreak,
    stats: updatedStats,
  });
}
