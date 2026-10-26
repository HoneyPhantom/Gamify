import { Env, AuthenticatedUser } from '../types';
import { jsonResponse } from '../utils/response';

export interface FeedItem {
  id: string;
  type: 'daily_solve' | 'badge_unlock' | 'challenge_victory' | 'tournament_climb';
  timestamp: string;
  user: {
    username: string;
    displayName: string;
    selectedFrame: string;
    selectedTitle: string;
  };
  text: string;
  icon: string;
}

export async function handleGetActivityFeed(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  // 1. Get friend IDs
  const friendRows = await env.DB.prepare(
    'SELECT friend_id FROM user_friends WHERE user_id = ?'
  ).bind(user.id).all<{ friend_id: string }>();

  const friendIds = (friendRows.results || []).map(r => r.friend_id);
  // Include caller and friends
  const relevantUserIds = [user.id, ...friendIds];

  const feedItems: FeedItem[] = [];

  // Query 1: Recent daily completions
  try {
    const placeholders = relevantUserIds.map(() => '?').join(',');
    const solves = await env.DB.prepare(`
      SELECT 
        dc.id,
        dc.user_id,
        dc.game_id,
        dc.difficulty,
        dc.completed_at,
        u.username,
        COALESCE(u.display_name, u.username) AS display_name,
        COALESCE(u.selected_frame, 'default') AS selected_frame,
        COALESCE(u.selected_title, '') AS selected_title,
        COALESCE(dl.score, 0) AS score,
        COALESCE(dl.time_taken_ms, 0) AS time_taken_ms
      FROM daily_completions dc
      JOIN users u ON dc.user_id = u.id
      LEFT JOIN daily_leaderboard dl 
        ON dl.user_id = dc.user_id 
        AND dl.game_id = dc.game_id 
        AND dl.difficulty = dc.difficulty 
        AND dl.played_date = dc.played_date
      WHERE dc.user_id IN (${placeholders}) AND dc.game_id != 'daily_sweep'
      ORDER BY dc.completed_at DESC
      LIMIT 15
    `).bind(...relevantUserIds).all<any>();

    (solves.results || []).forEach(r => {
      const timeStr = r.time_taken_ms > 0 ? ` in ${(r.time_taken_ms / 1000).toFixed(1)}s` : '';
      const scoreStr = r.score > 0 ? ` (+${r.score} Pts)` : '';
      feedItems.push({
        id: `solve_${r.id || `${r.user_id}_${r.game_id}_${r.completed_at}`}`,
        type: 'daily_solve',
        timestamp: r.completed_at,
        user: {
          username: r.username,
          displayName: r.display_name,
          selectedFrame: r.selected_frame,
          selectedTitle: r.selected_title,
        },
        text: `solved ${r.difficulty} ${r.game_id}${timeStr}${scoreStr}! ⚡`,
        icon: '🎯',
      });
    });
  } catch (err) {
    console.warn('Feed solves query note:', err);
  }

  // Query 2: Recent badge unlocks
  try {
    const placeholders = relevantUserIds.map(() => '?').join(',');
    const badges = await env.DB.prepare(`
      SELECT 
        ub.id,
        ub.badge_id,
        ub.unlocked_at,
        u.username,
        COALESCE(u.display_name, u.username) AS display_name,
        COALESCE(u.selected_frame, 'default') AS selected_frame,
        COALESCE(u.selected_title, '') AS selected_title
      FROM user_badges ub
      JOIN users u ON ub.user_id = u.id
      WHERE ub.user_id IN (${placeholders})
      ORDER BY ub.unlocked_at DESC
      LIMIT 10
    `).bind(...relevantUserIds).all<any>();

    (badges.results || []).forEach(r => {
      feedItems.push({
        id: `badge_${r.id || `${r.username}_${r.badge_id}`}`,
        type: 'badge_unlock',
        timestamp: r.unlocked_at,
        user: {
          username: r.username,
          displayName: r.display_name,
          selectedFrame: r.selected_frame,
          selectedTitle: r.selected_title,
        },
        text: `unlocked the "${r.badge_id.replace(/_/g, ' ')}" achievement badge! 🏆`,
        icon: '🏅',
      });
    });
  } catch (err) {
    console.warn('Feed badges query note:', err);
  }

  // Query 3: Recent challenge victories
  try {
    const challenges = await env.DB.prepare(`
      SELECT 
        c.id,
        c.game_id,
        c.difficulty,
        c.completed_at,
        u.username,
        COALESCE(u.display_name, u.username) AS display_name,
        COALESCE(u.selected_frame, 'default') AS selected_frame,
        COALESCE(u.selected_title, '') AS selected_title
      FROM user_challenges c
      JOIN users u ON c.winner_user_id = u.id
      WHERE c.status = 'completed' AND c.winner_user_id IS NOT NULL
      ORDER BY c.completed_at DESC
      LIMIT 10
    `).all<any>();

    (challenges.results || []).forEach(r => {
      feedItems.push({
        id: `chal_${r.id}`,
        type: 'challenge_victory',
        timestamp: r.completed_at,
        user: {
          username: r.username,
          displayName: r.display_name,
          selectedFrame: r.selected_frame,
          selectedTitle: r.selected_title,
        },
        text: `won a ${r.difficulty} ${r.game_id} head-to-head challenge! ⚔️`,
        icon: '👑',
      });
    });
  } catch (err) {
    console.warn('Feed challenge query note:', err);
  }

  // Sort unified feed items by timestamp descending
  feedItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return jsonResponse({
    success: true,
    feed: feedItems.slice(0, 20),
  });
}
