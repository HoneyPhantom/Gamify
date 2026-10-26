import { Env } from './types';
import { CORS_HEADERS, jsonResponse, errorResponse } from './utils/response';
import { authenticateRequest, handleRegister, handleLogin } from './auth';
import { handleUnlock } from './controllers/unlock';
import { handleSubmitScore } from './controllers/submitScore';
import { handleUseHint } from './controllers/hint';
import { handleGetLeaderboard } from './controllers/leaderboard';
import { handleGetFriends, handleAddFriend, handleRemoveFriend, handleSearchUsers, handleGetUserProfile, handleUpdateProfile } from './controllers/friends';
import { handleGetShop, handleBuyCosmetic, handleEquipCosmetic } from './controllers/shop';
import { handleCreateChallenge, handleGetChallenges, handleRespondChallenge } from './controllers/challenges';
import { handleGetActivityFeed } from './controllers/activityFeed';
import { calculateLevel } from './utils/level';
import { getTodayUTC } from './utils/date';

import { ensureDbSchema } from './utils/dbInit';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    // Handle CORS Preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // -------------------------------------------------------------------
    // Static Asset Delivery (Cloudflare Workers Static Assets / Pages)
    // -------------------------------------------------------------------
    if (!url.pathname.startsWith('/api')) {
      if (env.ASSETS) {
        return await env.ASSETS.fetch(request);
      }
      
      // Fallback if static assets binding is not yet attached
      if (url.pathname === '/' || url.pathname === '/index.html') {
        return new Response(
          `<!DOCTYPE html><html><head><title>Gamify API Online</title><style>body{font-family:sans-serif;background:#0b0f19;color:#e2e8f0;padding:2rem;text-align:center;}</style></head><body><h1>🎮 Gamify API Worker is Live</h1><p>Static assets are not bound. If deploying via Workers, configure <code>[assets] directory = "./dist"</code>. If deploying via Cloudflare Pages, set build output to <code>dist</code>.</p><p><a href="/api/leaderboard/wordle" style="color:#38bdf8">Check Leaderboard API</a></p></body></html>`,
          {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          }
        );
      }
    }

    try {
      // Ensure D1 database schema is ready
      await ensureDbSchema(env);
      // -------------------------------------------------------------------
      // 1. PIN Credential Auth Endpoints
      // -------------------------------------------------------------------
      if (method === 'POST' && url.pathname === '/api/auth/register') {
        const body: any = await request.json();
        const { token, user } = await handleRegister(body, env);
        return jsonResponse({
          success: true,
          message: 'Profile created successfully! 100 free starting coins awarded.',
          token,
          user,
        });
      }

      if (method === 'POST' && url.pathname === '/api/auth/login') {
        const body: any = await request.json();
        const { token, user } = await handleLogin(body, env);
        return jsonResponse({
          success: true,
          message: 'Welcome back! Session unlocked for 7 days.',
          token,
          user,
        });
      }

      // -------------------------------------------------------------------
      // 2. Public Leaderboard Route: GET /api/leaderboard/:gameId
      // -------------------------------------------------------------------
      const leaderboardMatch = url.pathname.match(/^\/api\/leaderboard\/([^/]+)$/);
      if (method === 'GET' && leaderboardMatch) {
        const gameId = leaderboardMatch[1];
        return await handleGetLeaderboard(request, env, gameId);
      }

      // -------------------------------------------------------------------
      // 3. User Self Profile: GET /api/me (Protected)
      // -------------------------------------------------------------------
      if (method === 'GET' && url.pathname === '/api/me') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        const todayStr = getTodayUTC();
        const [user, unlocks, stats, todayCompletions, badges, activityResult] = await Promise.all([
          env.DB.prepare('SELECT id, username, display_name, COALESCE(about, "Puzzle solver climbing to the top!") as about, coins, streak_count, COALESCE(xp, 0) as xp, COALESCE(selected_frame, "default") as selected_frame, COALESCE(selected_title, "") as selected_title, last_played_date, last_login_at FROM users WHERE id = ?')
            .bind(auth.user.id).first<any>(),
          env.DB.prepare('SELECT * FROM user_game_unlocks WHERE user_id = ?')
            .bind(auth.user.id).all(),
          env.DB.prepare('SELECT game_id, total_score, plays_count, best_score, best_streak, current_streak, ROUND(CAST(total_score AS REAL) / plays_count, 2) AS average_score FROM user_game_stats WHERE user_id = ?')
            .bind(auth.user.id).all(),
          env.DB.prepare('SELECT game_id, difficulty FROM daily_completions WHERE user_id = ? AND played_date = ?')
            .bind(auth.user.id, todayStr).all(),
          env.DB.prepare('SELECT badge_id FROM user_badges WHERE user_id = ?')
            .bind(auth.user.id).all(),
          env.DB.prepare(`
            SELECT played_date, COUNT(*) as completions_count
            FROM daily_completions
            WHERE user_id = ? AND game_id != 'daily_sweep'
            GROUP BY played_date
            ORDER BY played_date DESC
            LIMIT 30
          `).bind(auth.user.id).all<{ played_date: string; completions_count: number }>(),
        ]);

        const levelInfo = calculateLevel(user?.xp || 0);
        const activityMap: Record<string, number> = {};
        (activityResult.results || []).forEach(r => {
          activityMap[r.played_date] = r.completions_count;
        });

        return jsonResponse(
          {
            success: true,
            user,
            levelInfo,
            activityHistory: activityMap,
            unlocks: unlocks.results || [],
            stats: stats.results || [],
            todayCompletions: todayCompletions.results || [],
            badges: (badges.results || []).map((b: any) => b.badge_id),
          },
          200,
          {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          }
        );
      }

      // -------------------------------------------------------------------
      // 4. Friends & Player Search Endpoints
      // -------------------------------------------------------------------
      if (method === 'GET' && url.pathname === '/api/friends') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;
        return await handleGetFriends(request, env, auth.user);
      }

      if (method === 'POST' && url.pathname === '/api/friends/add') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;
        return await handleAddFriend(request, env, auth.user);
      }

      if (method === 'POST' && url.pathname === '/api/friends/remove') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;
        return await handleRemoveFriend(request, env, auth.user);
      }

      if (method === 'GET' && url.pathname === '/api/users/search') {
        return await handleSearchUsers(request, env);
      }

      const userProfileMatch = url.pathname.match(/^\/api\/users\/([^/]+)$/);
      if (method === 'GET' && userProfileMatch && userProfileMatch[1] !== 'search') {
        return await handleGetUserProfile(request, env, decodeURIComponent(userProfileMatch[1]));
      }

      if (method === 'PUT' && url.pathname === '/api/user/profile') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;
        return await handleUpdateProfile(request, env, auth.user);
      }

      // -------------------------------------------------------------------
      // 5. Game & Tier Unlock Mutation: POST /api/unlock (Protected)
      // -------------------------------------------------------------------
      if (method === 'POST' && url.pathname === '/api/unlock') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        return await handleUnlock(request, env, auth.user);
      }

      // -------------------------------------------------------------------
      // 6. Score Submission Mutation: POST /api/submit-score (Protected)
      // -------------------------------------------------------------------
      if (method === 'POST' && url.pathname === '/api/submit-score') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        return await handleSubmitScore(request, env, auth.user);
      }

      // -------------------------------------------------------------------
      // 7. Puzzle Hint Purchase Mutation: POST /api/games/hint (Protected)
      // -------------------------------------------------------------------
      if (method === 'POST' && url.pathname === '/api/games/hint') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        return await handleUseHint(request, env, auth.user);
      }

      // -------------------------------------------------------------------
      // 8. Cosmetic Shop Routes (Protected)
      // -------------------------------------------------------------------
      if (method === 'GET' && url.pathname === '/api/shop') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        return await handleGetShop(request, env, auth.user);
      }

      if (method === 'POST' && url.pathname === '/api/shop/buy') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        return await handleBuyCosmetic(request, env, auth.user);
      }

      if (method === 'POST' && url.pathname === '/api/shop/equip') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        return await handleEquipCosmetic(request, env, auth.user);
      }

      // -------------------------------------------------------------------
      // 9. PvP Challenges & Activity Feed Routes (Protected)
      // -------------------------------------------------------------------
      if (method === 'POST' && url.pathname === '/api/challenges/create') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        return await handleCreateChallenge(request, env, auth.user);
      }

      if (method === 'GET' && url.pathname === '/api/challenges') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        return await handleGetChallenges(request, env, auth.user);
      }

      if (method === 'POST' && url.pathname === '/api/challenges/respond') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        return await handleRespondChallenge(request, env, auth.user);
      }

      if (method === 'GET' && url.pathname === '/api/friends/feed') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        return await handleGetActivityFeed(request, env, auth.user);
      }

      // 404 Route Not Found
      return errorResponse(`Route not found: ${method} ${url.pathname}`, 404);
    } catch (err: any) {
      console.error('[Worker Error]', err);
      return errorResponse(err.message || 'Internal Server Error', 500);
    }
  },
};
