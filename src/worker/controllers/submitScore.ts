import { Env, AuthenticatedUser, SubmitScoreRequestBody, UserRow, UserGameUnlockRow, UserGameStatsRow } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';
import { getTodayUTC, getWeekIdUTC, calculateNextStreak } from '../utils/date';
import { checkAndAwardBadges } from '../utils/badges';
import { calculateLevel } from '../utils/level';

const REWARD_COINS: Record<string, number> = {
  easy: 15,
  medium: 35,
  hard: 75,
  playground: 0, // Playground gives infinite practice
};

const REWARD_XP: Record<string, number> = {
  easy: 15,
  medium: 35,
  hard: 75,
  playground: 10,
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

  // Anti-cheat: human speed check
  if (timeTakenMs < 1200) {
    return errorResponse('Completion time rejected: below physical human threshold', 422);
  }

  // 1. Verify user has unlocked the game and the tier
  let unlocks = await env.DB.prepare(
    'SELECT * FROM user_game_unlocks WHERE user_id = ? AND game_id = ?'
  ).bind(user.id, gameId).first<UserGameUnlockRow>();

  if (!unlocks && gameId === 'wordle') {
    const id = `${user.id}#${gameId}`;
    await env.DB.prepare(`
      INSERT INTO user_game_unlocks (id, user_id, game_id, game_unlocked, easy_unlocked, medium_unlocked, hard_unlocked, playground_unlocked)
      VALUES (?, ?, ?, 1, 1, 0, 0, 1)
    `).bind(id, user.id, gameId).run();

    unlocks = {
      id,
      user_id: user.id,
      game_id: gameId,
      game_unlocked: 1,
      easy_unlocked: 1,
      medium_unlocked: 0,
      hard_unlocked: 0,
      playground_unlocked: 1,
      unlocked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  if (!unlocks || unlocks.game_unlocked !== 1) {
    return errorResponse(`Access denied: Game '${gameId}' is locked. Unlock it with coins to record scores.`, 403, {
      code: 'GAME_LOCKED',
    });
  }

  const columnMap: Record<string, keyof UserGameUnlockRow> = {
    easy: 'easy_unlocked',
    medium: 'medium_unlocked',
    hard: 'hard_unlocked',
    playground: 'playground_unlocked',
  };

  const col = columnMap[difficulty];
  const isWordlePlayground = gameId === 'wordle' && difficulty === 'playground';
  if (!isWordlePlayground && (!col || unlocks[col] !== 1)) {
    return errorResponse(`Access denied: Tier '${difficulty}' is not unlocked for this game.`, 403, {
      code: 'TIER_LOCKED',
    });
  }

  // 2. Fetch current user state for streak & coins
  const currentUser = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(user.id).first<UserRow>();
  if (!currentUser) {
    return errorResponse('User profile not found', 404);
  }

  // Fetch current user_game_stats for this specific game
  const currentGameStats = await env.DB.prepare(
    'SELECT total_score, plays_count, best_score, best_streak, current_streak, last_daily_date FROM user_game_stats WHERE user_id = ? AND game_id = ?'
  ).bind(user.id, gameId).first<UserGameStatsRow>();

  // 3. Check daily reward eligibility & limit daily plays to once per day
  let coinsToAward = 0;
  let isFirstDailyCompletion = false;
  let newStreak = currentUser.streak_count;

  let nextGameCurrentStreak = currentGameStats?.current_streak ?? 0;
  let nextGameBestStreak = currentGameStats?.best_streak ?? 0;
  let nextGameLastDailyDate = currentGameStats?.last_daily_date ?? null;

  let isDailySweep = false;
  let dailySweepBonus = 0;

  if (difficulty !== 'playground') {
    const existingCompletion = await env.DB.prepare(`
      SELECT id FROM daily_completions 
      WHERE user_id = ? AND game_id = ? AND difficulty = ? AND played_date = ?
    `).bind(user.id, gameId, difficulty, playedDate).first<{ id: string }>();

    if (existingCompletion) {
      return errorResponse(`You have already completed the ${difficulty} daily challenge for today. Daily tiers can only be played once per day. Enjoy unlimited plays in Playground mode!`, 400, {
        code: 'DAILY_ALREADY_COMPLETED',
      });
    }

    isFirstDailyCompletion = true;
    const baseCoins = REWARD_COINS[difficulty] || 0;
    newStreak = calculateNextStreak(currentUser.last_played_date, currentUser.streak_count, playedDate);

    // DAILY PUZZLE STREAK FOR THIS GAME (Maintained by consecutive daily solves)
    nextGameCurrentStreak = calculateNextStreak(currentGameStats?.last_daily_date ?? null, currentGameStats?.current_streak ?? 0, playedDate);
    nextGameBestStreak = Math.max(currentGameStats?.best_streak ?? 0, nextGameCurrentStreak);
    nextGameLastDailyDate = playedDate;

    // 🔥 STREAK COIN MULTIPLIER: coins × (1 + streak × 0.1), capped at 3×
    // e.g. 7-day streak on hard: 75 × (1 + 7×0.1) = 75 × 1.7 = 127 coins
    const streakMultiplier = Math.min(3.0, 1 + newStreak * 0.1);
    coinsToAward = Math.round(baseCoins * streakMultiplier);

    // 🏆 DAILY SWEEP BONUS (+50 Coins when all 3 daily games solved on the same day)
    const ALL_REQUIRED_GAMES = ['wordle', 'number-grid', 'number-trail'];
    const sweepAlreadyClaimed = await env.DB.prepare(
      "SELECT id FROM daily_completions WHERE user_id = ? AND game_id = 'daily_sweep' AND played_date = ?"
    ).bind(user.id, playedDate).first();

    if (!sweepAlreadyClaimed) {
      const todayOtherGames = await env.DB.prepare(`
        SELECT DISTINCT game_id FROM daily_completions 
        WHERE user_id = ? AND played_date = ? AND game_id != ? AND game_id != 'daily_sweep'
      `).bind(user.id, playedDate, gameId).all<{ game_id: string }>();

      const completedGameIds = new Set((todayOtherGames.results || []).map(r => r.game_id));
      completedGameIds.add(gameId);

      if (ALL_REQUIRED_GAMES.every(g => completedGameIds.has(g))) {
        isDailySweep = true;
        dailySweepBonus = 50; // +50 Bonus Coins for completing all 3 games!
        coinsToAward += dailySweepBonus;
      }
    }
  }

  // Calculate XP earned for this completion
  let xpToAward = REWARD_XP[difficulty] || 10;
  if (timeTakenMs < 30000) xpToAward += 15; // Speed bonus XP
  else if (timeTakenMs < 60000) xpToAward += 10;

  // 4. Prepare atomic batch statements
  const batchStatements: D1PreparedStatement[] = [];

  // A. Upsert User Game Running Aggregates (SUM and COUNT) and per-game daily streaks
  batchStatements.push(
    env.DB.prepare(`
      INSERT INTO user_game_stats (user_id, game_id, total_score, plays_count, best_score, best_streak, current_streak, last_daily_date, updated_at)
      VALUES (?, ?, ?, 1, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, game_id) DO UPDATE SET
        total_score = user_game_stats.total_score + excluded.total_score,
        plays_count = user_game_stats.plays_count + 1,
        best_score = MAX(user_game_stats.best_score, excluded.best_score),
        best_streak = excluded.best_streak,
        current_streak = excluded.current_streak,
        last_daily_date = COALESCE(excluded.last_daily_date, user_game_stats.last_daily_date),
        updated_at = CURRENT_TIMESTAMP
    `).bind(user.id, gameId, score, score, nextGameBestStreak, nextGameCurrentStreak, nextGameLastDailyDate)
  );

  // B. Weekly Tournament Points Aggregation (Active Calendar Week)
  const currentWeekId = getWeekIdUTC();
  const tournamentId = `wt_${currentWeekId}_${user.id}`;
  batchStatements.push(
    env.DB.prepare(`
      INSERT INTO weekly_tournament (id, week_id, user_id, points, games_played, updated_at)
      VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(week_id, user_id) DO UPDATE SET
        points = weekly_tournament.points + excluded.points,
        games_played = weekly_tournament.games_played + 1,
        updated_at = CURRENT_TIMESTAMP
    `).bind(tournamentId, currentWeekId, user.id, score)
  );

  // C. If first daily completion, insert idempotency completion ledger & update user coins/streak/xp
  if (isFirstDailyCompletion) {
    const completionId = `cmp_${user.id}_${gameId}_${difficulty}_${playedDate}`;
    batchStatements.push(
      env.DB.prepare(`
        INSERT INTO daily_completions (id, user_id, game_id, difficulty, played_date, coins_awarded, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(completionId, user.id, gameId, difficulty, playedDate, coinsToAward - dailySweepBonus)
    );

    if (isDailySweep) {
      const sweepCompletionId = `cmp_${user.id}_daily_sweep_${playedDate}`;
      batchStatements.push(
        env.DB.prepare(`
          INSERT INTO daily_completions (id, user_id, game_id, difficulty, played_date, coins_awarded, completed_at)
          VALUES (?, ?, 'daily_sweep', 'easy', ?, ?, CURRENT_TIMESTAMP)
        `).bind(sweepCompletionId, user.id, playedDate, dailySweepBonus)
      );
    }

    batchStatements.push(
      env.DB.prepare(`
        UPDATE users 
        SET coins = coins + ?, 
            xp = COALESCE(xp, 0) + ?,
            streak_count = ?, 
            last_played_date = ?, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(coinsToAward, xpToAward, newStreak, playedDate, user.id)
    );

    // D. Daily Leaderboard Entry
    const leaderboardId = `lb_${gameId}_${difficulty}_${user.id}_${playedDate}`;
    batchStatements.push(
      env.DB.prepare(`
        INSERT INTO daily_leaderboard (id, game_id, difficulty, user_id, score, time_taken_ms, played_date, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(game_id, difficulty, user_id, played_date) DO UPDATE SET
          score = CASE WHEN excluded.score > daily_leaderboard.score THEN excluded.score ELSE daily_leaderboard.score END,
          time_taken_ms = CASE WHEN excluded.time_taken_ms < daily_leaderboard.time_taken_ms THEN excluded.time_taken_ms ELSE daily_leaderboard.time_taken_ms END
      `).bind(leaderboardId, gameId, difficulty, user.id, score, timeTakenMs, playedDate)
    );
  } else {
    // Playground mode: grant XP progression
    batchStatements.push(
      env.DB.prepare(`
        UPDATE users 
        SET xp = COALESCE(xp, 0) + ?, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(xpToAward, user.id)
    );
  }

  // Execute all updates atomically
  await env.DB.batch(batchStatements);

  // Fetch updated aggregates, balance and xp
  const [updatedStats, updatedUser] = await Promise.all([
    env.DB.prepare(`
      SELECT total_score, plays_count, best_score, best_streak, current_streak,
             ROUND(CAST(total_score AS REAL) / plays_count, 2) as average_score
      FROM user_game_stats 
      WHERE user_id = ? AND game_id = ?
    `).bind(user.id, gameId).first(),
    env.DB.prepare('SELECT coins, streak_count, COALESCE(xp, 0) as xp, selected_frame, selected_title FROM users WHERE id = ?').bind(user.id).first<{ coins: number; streak_count: number; xp: number; selected_frame: string; selected_title: string }>(),
  ]);

  const finalCoins = updatedUser?.coins ?? (currentUser.coins + coinsToAward);
  const finalStreak = updatedUser?.streak_count ?? newStreak;
  const finalXp = updatedUser?.xp ?? xpToAward;
  const levelInfo = calculateLevel(finalXp);

  // Evaluate & Award Badges
  const newBadgesUnlocked = await checkAndAwardBadges(env, user.id, {
    gameId,
    difficulty,
    timeTakenMs,
    wordleTries: body.wordleTries,
    streak: finalStreak,
    currentCoins: finalCoins,
    dailySweepCompleted: isDailySweep,
  });

  return jsonResponse({
    success: true,
    scoreSubmitted: score,
    timeTakenMs,
    isFirstDailyCompletion,
    coinsAwarded: coinsToAward,
    baseCoins: isFirstDailyCompletion ? (REWARD_COINS[difficulty] || 0) : 0,
    streakMultiplier: isFirstDailyCompletion ? Math.min(3.0, 1 + newStreak * 0.1) : 1,
    isDailySweep,
    dailySweepBonusCoins: dailySweepBonus,
    newBadgesUnlocked,
    currentCoins: finalCoins,
    streakCount: finalStreak,
    xpAwarded: xpToAward,
    totalXp: finalXp,
    levelInfo,
    stats: updatedStats,
  });
}
