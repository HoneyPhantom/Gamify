import { Env } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';
import { getTodayUTC } from '../utils/date';

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
      u.display_name,
      u.avatar_url,
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
  // Formula: total_score / plays_count (strictly filtering for plays_count >= 20)
  const globalQuery = `
    SELECT 
      ugs.user_id,
      u.display_name,
      u.avatar_url,
      ugs.plays_count,
      ugs.best_score,
      ROUND(CAST(ugs.total_score AS REAL) / ugs.plays_count, 2) AS global_average_score
    FROM user_game_stats ugs
    JOIN users u ON ugs.user_id = u.id
    WHERE ugs.game_id = ? AND ugs.plays_count >= 20
    ORDER BY global_average_score DESC, ugs.plays_count DESC
    LIMIT 50
  `;

  // Execute both queries concurrently
  const [dailyResult, globalResult] = await Promise.all([
    env.DB.prepare(dailyQuery).bind(...dailyParams).all(),
    env.DB.prepare(globalQuery).bind(gameId).all(),
  ]);

  return jsonResponse(
    {
      success: true,
      gameId,
      date: todayStr,
      dailyLeaderboard: dailyResult.results || [],
      globalLeaderboard: globalResult.results || [],
      meta: {
        dailyCount: dailyResult.results?.length ?? 0,
        globalMinPlaysThreshold: 20,
        globalCount: globalResult.results?.length ?? 0,
      },
    },
    200,
    {
      // Edge cache header: cache leaderboard at edge for 60 seconds
      'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=120',
    }
  );
}
