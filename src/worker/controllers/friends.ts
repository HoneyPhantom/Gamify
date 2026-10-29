import { Env, AuthenticatedUser } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';
import { calculateLevel } from '../utils/level';

/**
 * Controller for followers & following system, player username lookup, and profile management.
 */

// GET /api/friends - Returns followers and following for authenticated user
export async function handleGetFriends(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  const [followingResult, followersResult] = await Promise.all([
    // People the user is FOLLOWING (user_id = user.id)
    env.DB.prepare(`
      SELECT 
        u.id, 
        u.username, 
        u.display_name, 
        COALESCE(u.about, 'Puzzle solver climbing to the top!') as about
      FROM user_friends f
      JOIN users u ON f.friend_id = u.id
      WHERE f.user_id = ?
      ORDER BY u.display_name ASC
    `).bind(user.id).all(),

    // People who are FOLLOWERS of the user (friend_id = user.id)
    env.DB.prepare(`
      SELECT 
        u.id, 
        u.username, 
        u.display_name, 
        COALESCE(u.about, 'Puzzle solver climbing to the top!') as about
      FROM user_friends f
      JOIN users u ON f.user_id = u.id
      WHERE f.friend_id = ?
      ORDER BY u.display_name ASC
    `).bind(user.id).all(),
  ]);

  const following = followingResult.results || [];
  const followers = followersResult.results || [];

  return jsonResponse({
    success: true,
    following,
    followers,
    followingCount: following.length,
    followersCount: followers.length,
    friends: following, // Backward compatibility
  });
}

// POST /api/friends/add - Follow player by username
export async function handleAddFriend(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: { friendUsername?: string; username?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const rawUsername = (body.friendUsername || body.username)?.trim().toLowerCase();
  if (!rawUsername) {
    return errorResponse('Missing username. Please enter a valid player username.', 400);
  }

  if (rawUsername === user.username.toLowerCase()) {
    return errorResponse('You cannot follow yourself', 400);
  }

  // Find target player
  const targetUser = await env.DB.prepare(
    'SELECT id, username, display_name FROM users WHERE LOWER(username) = ?'
  ).bind(rawUsername).first<{ id: string; username: string; display_name: string }>();

  if (!targetUser) {
    return errorResponse(`Player with username '@${rawUsername}' was not found.`, 404);
  }

  // Insert follow relationship
  await env.DB.prepare(
    'INSERT OR IGNORE INTO user_friends (user_id, friend_id, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
  ).bind(user.id, targetUser.id).run();

  return jsonResponse({
    success: true,
    message: `Now following @${targetUser.username}!`,
    following: true,
    friend: {
      id: targetUser.id,
      username: targetUser.username,
      display_name: targetUser.display_name,
    },
  });
}

// POST /api/friends/remove - Unfollow player
export async function handleRemoveFriend(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: { friendId?: string; username?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  let friendId = body.friendId?.trim();
  if (!friendId && body.username) {
    const target = await env.DB.prepare('SELECT id FROM users WHERE LOWER(username) = ?')
      .bind(body.username.trim().toLowerCase())
      .first<{ id: string }>();
    if (target) friendId = target.id;
  }

  if (!friendId) {
    return errorResponse('Missing friendId or username', 400);
  }

  await env.DB.prepare(
    'DELETE FROM user_friends WHERE user_id = ? AND friend_id = ?'
  ).bind(user.id, friendId).run();

  return jsonResponse({
    success: true,
    message: 'Unfollowed player successfully.',
    following: false,
    friendId,
  });
}

// GET /api/users/search?q=... - Search players by username or display name
export async function handleSearchUsers(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const query = (url.searchParams.get('q') || '').trim().toLowerCase();

  if (!query || query.length < 2) {
    return jsonResponse({ success: true, users: [] });
  }

  const result = await env.DB.prepare(`
    SELECT 
      id, 
      username, 
      display_name, 
      COALESCE(about, 'Puzzle solver climbing to the top!') as about
    FROM users
    WHERE LOWER(username) LIKE ? OR LOWER(display_name) LIKE ?
    ORDER BY username ASC
    LIMIT 10
  `).bind(`%${query}%`, `%${query}%`).all();

  return jsonResponse({
    success: true,
    users: result.results || [],
  });
}

// GET /api/users/:username - Public profile lookup (shows gamertag, about, followers & following count, streaks)
export async function handleGetUserProfile(
  request: Request,
  env: Env,
  username: string
): Promise<Response> {
  const cleanUsername = username.trim().toLowerCase();
  const [row, statsResult, followersCount, followingCount] = await Promise.all([
    env.DB.prepare(`
      SELECT 
        id,
        username, 
        display_name, 
        COALESCE(about, 'Puzzle solver climbing to the top!') as about,
        COALESCE(xp, 0) as xp,
        COALESCE(selected_frame, 'default') as selected_frame,
        COALESCE(selected_title, '') as selected_title
      FROM users 
      WHERE LOWER(username) = ?
    `).bind(cleanUsername).first<{ id: string; username: string; display_name: string; about: string; xp: number; selected_frame: string; selected_title: string }>(),
    
    env.DB.prepare(`
      SELECT game_id, best_streak, current_streak
      FROM user_game_stats
      WHERE user_id = (SELECT id FROM users WHERE LOWER(username) = ?)
    `).bind(cleanUsername).all<{ game_id: string; best_streak: number; current_streak: number }>(),

    // Followers count: how many follow this user
    env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM user_friends
      WHERE friend_id = (SELECT id FROM users WHERE LOWER(username) = ?)
    `).bind(cleanUsername).first<{ count: number }>(),

    // Following count: how many this user follows
    env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM user_friends
      WHERE user_id = (SELECT id FROM users WHERE LOWER(username) = ?)
    `).bind(cleanUsername).first<{ count: number }>(),
  ]);

  if (!row) {
    return errorResponse(`User '@${username}' not found`, 404);
  }

  const lvl = calculateLevel(row.xp || 0);

  return jsonResponse({
    success: true,
    profile: {
      id: row.id,
      username: row.username,
      gamertag: row.display_name,
      displayName: row.display_name,
      about: row.about,
      xp: row.xp,
      level: lvl.level,
      levelTitle: lvl.title,
      selectedFrame: row.selected_frame || 'default',
      selectedTitle: row.selected_title || '',
      streaks: statsResult.results || [],
      followersCount: followersCount?.count || 0,
      followingCount: followingCount?.count || 0,
    },
  });
}

// PUT /api/user/profile - Update user's about description and gamertag (display_name)
export async function handleUpdateProfile(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: { displayName?: string; about?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const newDisplayName = body.displayName?.trim() || null;
  const newAbout = body.about?.trim() || null;

  if (newDisplayName && newDisplayName.length > 50) {
    return errorResponse('Gamertag cannot exceed 50 characters', 400);
  }

  if (newAbout && newAbout.length > 250) {
    return errorResponse('About description cannot exceed 250 characters', 400);
  }

  await env.DB.prepare(`
    UPDATE users 
    SET 
      display_name = COALESCE(?, display_name),
      about = COALESCE(?, about),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(newDisplayName, newAbout, user.id).run();

  const updatedUser = await env.DB.prepare(`
    SELECT id, username, display_name, about, coins, streak_count
    FROM users WHERE id = ?
  `).bind(user.id).first();

  return jsonResponse({
    success: true,
    message: 'Profile updated successfully!',
    user: updatedUser,
  });
}
