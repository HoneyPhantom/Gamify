import { Env, AuthenticatedUser } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';

/**
 * Controller for friends system, player username lookup, and profile management.
 */

// GET /api/friends - Returns list of friends for the authenticated user
export async function handleGetFriends(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  const result = await env.DB.prepare(`
    SELECT 
      u.id, 
      u.username, 
      u.display_name, 
      COALESCE(u.about, 'Puzzle solver climbing to the top!') as about
    FROM user_friends f
    JOIN users u ON f.friend_id = u.id
    WHERE f.user_id = ?
    ORDER BY u.display_name ASC
  `).bind(user.id).all();

  return jsonResponse({
    success: true,
    friends: result.results || [],
  });
}

// POST /api/friends/add - Add friend by username
export async function handleAddFriend(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: { friendUsername?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const rawUsername = body.friendUsername?.trim().toLowerCase();
  if (!rawUsername) {
    return errorResponse('Missing friendUsername', 400);
  }

  if (rawUsername === user.username.toLowerCase()) {
    return errorResponse('You cannot add yourself as a friend', 400);
  }

  // Find target friend
  const targetUser = await env.DB.prepare(
    'SELECT id, username, display_name FROM users WHERE LOWER(username) = ?'
  ).bind(rawUsername).first<{ id: string; username: string; display_name: string }>();

  if (!targetUser) {
    return errorResponse(`Player with username '@${rawUsername}' was not found.`, 404);
  }

  // Insert friendship
  await env.DB.prepare(
    'INSERT OR IGNORE INTO user_friends (user_id, friend_id, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
  ).bind(user.id, targetUser.id).run();

  return jsonResponse({
    success: true,
    message: `Added @${targetUser.username} to your friends list!`,
    friend: {
      id: targetUser.id,
      username: targetUser.username,
      display_name: targetUser.display_name,
    },
  });
}

// POST /api/friends/remove - Remove friend
export async function handleRemoveFriend(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: { friendId?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const friendId = body.friendId?.trim();
  if (!friendId) {
    return errorResponse('Missing friendId', 400);
  }

  await env.DB.prepare(
    'DELETE FROM user_friends WHERE user_id = ? AND friend_id = ?'
  ).bind(user.id, friendId).run();

  return jsonResponse({
    success: true,
    message: 'Friend removed successfully.',
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

// GET /api/users/:username - Public profile lookup (shows only gamertag and description)
export async function handleGetUserProfile(
  request: Request,
  env: Env,
  username: string
): Promise<Response> {
  const cleanUsername = username.trim().toLowerCase();
  const row = await env.DB.prepare(`
    SELECT 
      id,
      username, 
      display_name, 
      COALESCE(about, 'Puzzle solver climbing to the top!') as about
    FROM users 
    WHERE LOWER(username) = ?
  `).bind(cleanUsername).first<{ id: string; username: string; display_name: string; about: string }>();

  if (!row) {
    return errorResponse(`User '@${username}' not found`, 404);
  }

  return jsonResponse({
    success: true,
    profile: {
      id: row.id,
      username: row.username,
      gamertag: row.display_name,
      about: row.about,
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
