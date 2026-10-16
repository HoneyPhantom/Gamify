import { Env } from './types';
import { CORS_HEADERS, jsonResponse, errorResponse } from './utils/response';
import { authenticateRequest, handleGoogleAuth } from './auth';
import { handleUnlock } from './controllers/unlock';
import { handleSubmitScore } from './controllers/submitScore';
import { handleGetLeaderboard } from './controllers/leaderboard';

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

    try {
      // -------------------------------------------------------------------
      // 1. Google OAuth Token Exchange Endpoint
      // -------------------------------------------------------------------
      if (method === 'POST' && url.pathname === '/api/auth/google') {
        const body: any = await request.json();
        if (!body.idToken) {
          return errorResponse("Missing 'idToken' in auth payload", 400);
        }
        const { token, user } = await handleGoogleAuth(body.idToken, env);
        return jsonResponse({
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            displayName: user.display_name,
            avatarUrl: user.avatar_url,
            coins: user.coins,
            streakCount: user.streak_count,
            lastPlayedDate: user.last_played_date,
          },
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
          env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(auth.user.id).first(),
          env.DB.prepare('SELECT * FROM user_game_unlocks WHERE user_id = ?').bind(auth.user.id).all(),
        ]);

        return jsonResponse({
          success: true,
          user,
          unlocks: unlocks.results || [],
        });
      }

      // -------------------------------------------------------------------
      // 4. Game Unlock Mutation: POST /api/unlock (Protected)
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
