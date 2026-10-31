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
import { getTodayUTC, getYesterdayUTC, evaluateActiveStreak } from './utils/date';

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
      // 301 Permanent Redirect from trademarked /games/wordle to generic /games/word-guess
      if (url.pathname === '/games/wordle' || url.pathname === '/games/wordle/') {
        return Response.redirect(`${url.origin}/games/word-guess`, 301);
      }

      if (env.ASSETS) {
        let assetRes = await env.ASSETS.fetch(request);
        const pathname = url.pathname;

        // SPA Fallback: for clean URLs like /games/*, /privacy, /about, /contact, /terms
        if (assetRes.status === 404 && !pathname.includes('.')) {
          // Check if there is a direct static HTML file in dist/ (e.g., /privacy -> /privacy.html)
          const directHtmlUrl = new URL(`${pathname.replace(/\/$/, '')}.html`, request.url);
          const directHtmlRes = await env.ASSETS.fetch(new Request(directHtmlUrl.toString(), request));
          if (directHtmlRes.status === 200) {
            assetRes = directHtmlRes;
          } else {
            // Fallback to index.html for client-side routing
            const indexUrl = new URL('/index.html', request.url);
            assetRes = await env.ASSETS.fetch(new Request(indexUrl.toString(), request));
          }
        }

        // Never allow browsers or intermediate caches to cache HTML or the service worker
        const isHtmlOrSw = pathname === '/' || pathname === '/index.html' || pathname === '/sw.js' || (!pathname.includes('.') && !pathname.startsWith('/assets/'));
        if (isHtmlOrSw) {
          const freshHeaders = new Headers(assetRes.headers);
          freshHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
          freshHeaders.set('Pragma', 'no-cache');
          freshHeaders.set('Expires', '0');
          freshHeaders.set('Content-Type', pathname === '/sw.js' ? 'application/javascript; charset=utf-8' : 'text/html; charset=utf-8');
          return new Response(assetRes.body, {
            status: assetRes.status,
            statusText: assetRes.statusText,
            headers: freshHeaders,
          });
        }

        // Hashed Vite assets can be safely cached long-term
        if (pathname.startsWith('/assets/')) {
          const freshHeaders = new Headers(assetRes.headers);
          freshHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
          return new Response(assetRes.body, {
            status: assetRes.status,
            statusText: assetRes.statusText,
            headers: freshHeaders,
          });
        }

        return assetRes;
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
        const rawGameId = leaderboardMatch[1];
        const gameId = rawGameId === 'word-guess' ? 'wordle' : rawGameId;
        return await handleGetLeaderboard(request, env, gameId);
      }

      // -------------------------------------------------------------------
      // 3. User Self Profile: GET /api/me (Protected)
      // -------------------------------------------------------------------
      if (method === 'GET' && url.pathname === '/api/me') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        const todayStr = getTodayUTC();
        const yesterdayStr = getYesterdayUTC();
        const [user, unlocks, stats, todayCompletions, followingResult, followersCountResult, pendingChallengesResult] = await Promise.all([
          env.DB.prepare('SELECT id, username, display_name, COALESCE(about, "Puzzle solver climbing to the top!") as about, coins, streak_count, COALESCE(best_streak, streak_count) as best_streak, COALESCE(xp, 0) as xp, COALESCE(selected_frame, "default") as selected_frame, COALESCE(selected_title, "") as selected_title, last_played_date, last_login_at FROM users WHERE id = ?')
            .bind(auth.user.id).first<any>(),
          env.DB.prepare('SELECT * FROM user_game_unlocks WHERE user_id = ?')
            .bind(auth.user.id).all(),
          env.DB.prepare('SELECT game_id, total_score, plays_count, best_score, best_streak, current_streak, last_daily_date, ROUND(CAST(total_score AS REAL) / plays_count, 2) AS average_score FROM user_game_stats WHERE user_id = ?')
            .bind(auth.user.id).all(),
          env.DB.prepare('SELECT game_id, difficulty FROM daily_completions WHERE user_id = ? AND played_date = ?')
            .bind(auth.user.id, todayStr).all(),
          env.DB.prepare(`
            SELECT u.id, u.username, u.display_name, COALESCE(u.about, 'Puzzle solver climbing to the top!') as about
            FROM user_friends f
            JOIN users u ON f.friend_id = u.id
            WHERE f.user_id = ?
            ORDER BY u.display_name ASC
          `).bind(auth.user.id).all(),
          env.DB.prepare('SELECT COUNT(*) as count FROM user_friends WHERE friend_id = ?')
            .bind(auth.user.id).first<{ count: number }>(),
          env.DB.prepare(`
            SELECT 
              c.id, c.from_user_id, c.game_id, c.difficulty, c.target_score, c.challenger_time_ms, c.status, c.created_at,
              u.username AS challenger_username, COALESCE(u.display_name, u.username) AS challenger_display_name
            FROM user_challenges c
            JOIN users u ON c.from_user_id = u.id
            WHERE c.to_user_id = ? AND c.status = 'pending'
            ORDER BY c.created_at DESC
          `).bind(auth.user.id).all(),
        ]);

        if (user) {
          const { activeStreak, isMaintainedToday } = evaluateActiveStreak(user.last_played_date, user.streak_count, todayStr, yesterdayStr);
          user.streak_count = activeStreak;
          user.is_streak_maintained_today = isMaintainedToday;
          user.best_streak = Math.max(user.best_streak || 0, activeStreak);
        }

        const rawStats = (stats.results || []) as any[];
        const evaluatedStats = rawStats.map(s => {
          const { activeStreak, isMaintainedToday } = evaluateActiveStreak(s.last_daily_date, s.current_streak, todayStr, yesterdayStr);
          return {
            ...s,
            current_streak: activeStreak,
            best_streak: Math.max(s.best_streak || 0, activeStreak),
            is_streak_maintained_today: isMaintainedToday,
          };
        });

        const levelInfo = calculateLevel(user?.xp || 0);
        const following = followingResult.results || [];

        return jsonResponse(
          {
            success: true,
            user,
            levelInfo,
            unlocks: unlocks.results || [],
            stats: evaluatedStats,
            todayCompletions: todayCompletions.results || [],
            following,
            followingCount: following.length,
            followersCount: followersCountResult?.count || 0,
            pendingChallenges: pendingChallengesResult.results || [],
            pendingChallengesCount: (pendingChallengesResult.results || []).length,
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
