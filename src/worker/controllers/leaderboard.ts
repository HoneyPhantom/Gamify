import { Env } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';
import { getTodayUTC, getWeekIdUTC } from '../utils/date';
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
  const currentWeekId = getWeekIdUTC();
  const requestedWeek = url.searchParams.get('week') || url.searchParams.get('week_id') || currentWeekId;

  const isAllGames = gameId === 'all';

  // 1. Fetch Today's Daily Leaderboard
  let dailyQuery = `
    SELECT 
      dl.difficulty,
      dl.score,
      dl.time_taken_ms,
      u.id as user_id,
      COALESCE(u.display_name, u.username) as display_name,
      u.username,
      u.streak_count,
      u.xp,
      u.selected_frame,
      u.selected_title
    FROM daily_leaderboard dl
    JOIN users u ON dl.user_id = u.id
    WHERE ${isAllGames ? 'dl.played_date = ?' : 'dl.game_id = ? AND dl.played_date = ?'}
  `;
  const dailyParams: unknown[] = isAllGames ? [todayStr] : [gameId, todayStr];

  if (difficulty) {
    dailyQuery += ` AND dl.difficulty = ?`;
    dailyParams.push(difficulty);
  }

  dailyQuery += ` ORDER BY dl.score DESC, dl.time_taken_ms ASC LIMIT 50`;

  // 2. Fetch Global Leaderboard computed efficiently via running aggregates
  const globalQuery = isAllGames
    ? `
      SELECT 
        ugs.user_id,
        COALESCE(u.display_name, u.username) AS display_name,
        u.username,
        u.xp,
        u.selected_frame,
        u.selected_title,
        SUM(ugs.total_score) AS total_score,
        SUM(ugs.plays_count) AS plays_count,
        MAX(ugs.best_score) AS best_score,
        ROUND(AVG(CAST(ugs.total_score AS REAL) / ugs.plays_count), 2) AS global_average_score
      FROM user_game_stats ugs
      JOIN users u ON ugs.user_id = u.id
      GROUP BY ugs.user_id
      ORDER BY SUM(ugs.total_score) DESC, SUM(ugs.plays_count) DESC
      LIMIT 50
    `
    : `
      SELECT 
        ugs.user_id,
        COALESCE(u.display_name, u.username) AS display_name,
        u.username,
        u.xp,
        u.selected_frame,
        u.selected_title,
        ugs.total_score,
        ugs.plays_count,
        ugs.best_score,
        ROUND(CAST(ugs.total_score AS REAL) / ugs.plays_count, 2) AS global_average_score
      FROM user_game_stats ugs
      JOIN users u ON ugs.user_id = u.id
      WHERE ugs.game_id = ? AND ugs.plays_count >= 1
      ORDER BY ugs.total_score DESC, ugs.plays_count DESC, ugs.best_score DESC
      LIMIT 50
    `;

  // 3. Weekly Tournament Leaderboard for the active week
  const weeklyQuery = `
    SELECT 
      wt.user_id,
      COALESCE(u.display_name, u.username) AS display_name,
      u.username,
      u.xp,
      u.selected_frame,
      u.selected_title,
      wt.points,
      wt.games_played
    FROM weekly_tournament wt
    JOIN users u ON wt.user_id = u.id
    WHERE wt.week_id = ?
    ORDER BY wt.points DESC, wt.games_played DESC
    LIMIT 50
  `;

  // 4. Optional Friends Leaderboard if caller is authenticated
  let friendsPromise: Promise<unknown[]> = Promise.resolve([]);
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    friendsPromise = (async () => {
      try {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return [];
        const friendsQuery = isAllGames
          ? `
            SELECT 
              ugs.user_id,
              COALESCE(u.display_name, u.username) AS display_name,
              u.username,
              u.xp,
              u.selected_frame,
              u.selected_title,
              SUM(ugs.total_score) AS total_score,
              SUM(ugs.plays_count) AS plays_count,
              MAX(ugs.best_score) AS best_score,
              ROUND(AVG(CAST(ugs.total_score AS REAL) / ugs.plays_count), 2) AS global_average_score
            FROM user_game_stats ugs
            JOIN users u ON ugs.user_id = u.id
            WHERE (ugs.user_id = ? OR ugs.user_id IN (SELECT friend_id FROM user_friends WHERE user_id = ?))
            GROUP BY ugs.user_id
            ORDER BY SUM(ugs.total_score) DESC
            LIMIT 50
          `
          : `
            SELECT 
              ugs.user_id,
              COALESCE(u.display_name, u.username) AS display_name,
              u.username,
              u.xp,
              u.selected_frame,
              u.selected_title,
              ugs.total_score,
              ugs.plays_count,
              ugs.best_score,
              ROUND(CAST(ugs.total_score AS REAL) / ugs.plays_count, 2) AS global_average_score
            FROM user_game_stats ugs
            JOIN users u ON ugs.user_id = u.id
            WHERE ugs.game_id = ? 
              AND (ugs.user_id = ? OR ugs.user_id IN (SELECT friend_id FROM user_friends WHERE user_id = ?))
              AND ugs.plays_count >= 1
            ORDER BY ugs.total_score DESC, ugs.plays_count DESC, ugs.best_score DESC
            LIMIT 50
          `;
        const params = isAllGames ? [auth.user.id, auth.user.id] : [gameId, auth.user.id, auth.user.id];
        const res = await env.DB.prepare(friendsQuery).bind(...params).all();
        return res.results || [];
      } catch {
        return [];
      }
    })();
  }

  // Execute all queries concurrently
  const [dailyResult, globalResult, weeklyResult, friendsResult, pastWeeksResult] = await Promise.all([
    env.DB.prepare(dailyQuery).bind(...dailyParams).all(),
    isAllGames ? env.DB.prepare(globalQuery).all() : env.DB.prepare(globalQuery).bind(gameId).all(),
    env.DB.prepare(weeklyQuery).bind(requestedWeek).all(),
    friendsPromise,
    env.DB.prepare('SELECT DISTINCT week_id FROM weekly_tournament WHERE week_id != ? ORDER BY week_id DESC LIMIT 10').bind(currentWeekId).all(),
  ]);

  const pastWeeks = (pastWeeksResult.results || []).map((r: any) => r.week_id);

  return jsonResponse(
    {
      success: true,
      gameId,
      date: todayStr,
      currentWeekId,
      requestedWeek,
      pastWeeks,
      dailyLeaderboard: dailyResult.results || [],
      globalLeaderboard: globalResult.results || [],
      weeklyTournament: weeklyResult.results || [],
      friendsLeaderboard: friendsResult || [],
      meta: {
        dailyCount: dailyResult.results?.length ?? 0,
        globalMinPlaysThreshold: 1,
        globalCount: globalResult.results?.length ?? 0,
        weeklyCount: weeklyResult.results?.length ?? 0,
        friendsCount: (friendsResult as unknown[])?.length ?? 0,
      },
    },
    200,
    {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  );
}
