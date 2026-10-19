import { Env } from './types';
import { CORS_HEADERS, jsonResponse, errorResponse } from './utils/response';
import { authenticateRequest, handleRegister, handleLogin } from './auth';
import { handleUnlock } from './controllers/unlock';
import { handleSubmitScore } from './controllers/submitScore';
import { handleGetLeaderboard } from './controllers/leaderboard';

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

        const [user, unlocks] = await Promise.all([
          env.DB.prepare('SELECT id, username, display_name, coins, streak_count, last_played_date, last_login_at FROM users WHERE id = ?')
            .bind(auth.user.id).first(),
          env.DB.prepare('SELECT * FROM user_game_unlocks WHERE user_id = ?')
            .bind(auth.user.id).all(),
        ]);

        return jsonResponse({
          success: true,
          user,
          unlocks: unlocks.results || [],
        });
      }

      // -------------------------------------------------------------------
      // 4. Game & Tier Unlock Mutation: POST /api/unlock (Protected)
      // -------------------------------------------------------------------
      if (method === 'POST' && url.pathname === '/api/unlock') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        return await handleUnlock(request, env, auth.user);
      }

      // -------------------------------------------------------------------
      // 5. Score Submission Mutation: POST /api/submit-score (Protected)
      // -------------------------------------------------------------------
      if (method === 'POST' && url.pathname === '/api/submit-score') {
        const auth = await authenticateRequest(request, env);
        if ('error' in auth) return auth.error;

        return await handleSubmitScore(request, env, auth.user);
      }

      // 404 Route Not Found
      return errorResponse(`Route not found: ${method} ${url.pathname}`, 404);
    } catch (err: any) {
      console.error('[Worker Error]', err);
      return errorResponse(err.message || 'Internal Server Error', 500);
    }
  },
};
