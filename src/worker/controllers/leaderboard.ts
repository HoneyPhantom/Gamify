import { Env } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';
import { getTodayUTC } from '../utils/date';
import { authenticateRequest } from '../auth';

export async function handleGetLeaderboard(
  request: Request,
  env: Env,
  gameId: string
): Promise<Response> {
  if (!gameId) {
    return errorResponse("Missing required 'gameId' path parameter", 400);
  }

  const url = new URL(request.url);
  const difficulty = url.searchParams.get('difficulty'); // Optional filter: easy, medium, hard
  const todayStr = url.searchParams.get('date') || getTodayUTC();

  // 1. Fetch Today's Daily Leaderboard
  let dailyQuery = `
    SELECT 
      dl.difficulty,
      dl.score,
      dl.time_taken_ms,
      u.id as user_id,
      COALESCE(u.display_name, u.username) as display_name,
      u.username,
      u.streak_count
    FROM daily_leaderboard dl
    JOIN users u ON dl.user_id = u.id
    WHERE dl.game_id = ? AND dl.played_date = ?
  `;
  const dailyParams: unknown[] = [gameId, todayStr];

  if (difficulty) {
    dailyQuery += ` AND dl.difficulty = ?`;
    dailyParams.push(difficulty);
  }

  dailyQuery += ` ORDER BY dl.score DESC, dl.time_taken_ms ASC LIMIT 50`;

  // 2. Fetch Global Leaderboard computed efficiently via running aggregates
  // Ranking is strictly based on average score, with plays_count (games played) as the tie breaker
  const globalQuery = `
    SELECT 
      ugs.user_id,
      COALESCE(u.display_name, u.username) AS display_name,
      u.username,
      ugs.plays_count,
      ugs.best_score,
      ROUND(CAST(ugs.total_score AS REAL) / ugs.plays_count, 2) AS global_average_score
    FROM user_game_stats ugs
    JOIN users u ON ugs.user_id = u.id
    WHERE ugs.game_id = ? AND ugs.plays_count >= 1
    ORDER BY (CAST(ugs.total_score AS REAL) / ugs.plays_count) DESC, ugs.plays_count DESC, ugs.best_score DESC
    LIMIT 50
  `;

  // 3. Optional Friends Leaderboard if caller is authenticated
  let friendsPromise: Promise<unknown[]> = Promise.resolve([]);
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    friendsPromise = (async () => {
      try {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return [];
        const friendsQuery = `
          SELECT 
            ugs.user_id,
            COALESCE(u.display_name, u.username) AS display_name,
            u.username,
            ugs.plays_count,
            ugs.best_score,
            ROUND(CAST(ugs.total_score AS REAL) / ugs.plays_count, 2) AS global_average_score
          FROM user_game_stats ugs
          JOIN users u ON ugs.user_id = u.id
          WHERE ugs.game_id = ? 
            AND (ugs.user_id = ? OR ugs.user_id IN (SELECT friend_id FROM user_friends WHERE user_id = ?))
            AND ugs.plays_count >= 1
          ORDER BY (CAST(ugs.total_score AS REAL) / ugs.plays_count) DESC, ugs.plays_count DESC, ugs.best_score DESC
          LIMIT 50
        `;
        const res = await env.DB.prepare(friendsQuery).bind(gameId, auth.user.id, auth.user.id).all();
        return res.results || [];
      } catch {
        return [];
      }
    })();
  }

  // Execute all queries concurrently
  const [dailyResult, globalResult, friendsResult] = await Promise.all([
    env.DB.prepare(dailyQuery).bind(...dailyParams).all(),
    env.DB.prepare(globalQuery).bind(gameId).all(),
    friendsPromise,
  ]);

  return jsonResponse(
    {
      success: true,
      gameId,
      date: todayStr,
      dailyLeaderboard: dailyResult.results || [],
      globalLeaderboard: globalResult.results || [],
      friendsLeaderboard: friendsResult || [],
      meta: {
        dailyCount: dailyResult.results?.length ?? 0,
        globalMinPlaysThreshold: 1,
        globalCount: globalResult.results?.length ?? 0,
        friendsCount: (friendsResult as unknown[])?.length ?? 0,
      },
    },
    200,
    {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  );
}
