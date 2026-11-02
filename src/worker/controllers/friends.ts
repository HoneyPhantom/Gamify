import { Env, AuthenticatedUser } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';
import { calculateLevel } from '../utils/level';
import { getTodayUTC, getYesterdayUTC, evaluateActiveStreak } from '../utils/date';
import { authenticateRequest } from '../auth';

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

// GET /api/users/:identifier - Profile lookup by username OR user ID (with public/private filter)
export async function handleGetUserProfile(
  request: Request,
  env: Env,
  identifier: string
): Promise<Response> {
  const cleanIdOrUsername = identifier.trim().toLowerCase();

  // Check viewer identity if authorization header is provided
  let viewer: AuthenticatedUser | null = null;
  try {
    const authRes = await authenticateRequest(request, env);
    if ('user' in authRes && authRes.user) {
      viewer = authRes.user;
    }
  } catch {}

  const [row, statsResult, followersCount, followingCount] = await Promise.all([
    env.DB.prepare(`
      SELECT 
        id,
        username, 
        display_name, 
        COALESCE(about, 'Puzzle solver climbing to the top!') as about,
        COALESCE(xp, 0) as xp,
        COALESCE(selected_frame, 'default') as selected_frame,
        COALESCE(selected_title, '') as selected_title,
        COALESCE(is_private, 0) as is_private
      FROM users 
      WHERE id = ? OR LOWER(username) = ?
    `).bind(cleanIdOrUsername, cleanIdOrUsername).first<{ id: string; username: string; display_name: string; about: string; xp: number; selected_frame: string; selected_title: string; is_private: number }>(),
    
    env.DB.prepare(`
      SELECT game_id, best_streak, current_streak, last_daily_date
      FROM user_game_stats
      WHERE user_id = (SELECT id FROM users WHERE id = ? OR LOWER(username) = ?)
    `).bind(cleanIdOrUsername, cleanIdOrUsername).all<{ game_id: string; best_streak: number; current_streak: number; last_daily_date: string | null }>(),

    // Followers count: how many follow this user
    env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM user_friends
      WHERE friend_id = (SELECT id FROM users WHERE id = ? OR LOWER(username) = ?)
    `).bind(cleanIdOrUsername, cleanIdOrUsername).first<{ count: number }>(),

    // Following count: how many this user follows
    env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM user_friends
      WHERE user_id = (SELECT id FROM users WHERE id = ? OR LOWER(username) = ?)
    `).bind(cleanIdOrUsername, cleanIdOrUsername).first<{ count: number }>(),
  ]);

  if (!row) {
    return errorResponse(`User '${identifier}' not found`, 404);
  }

  const isSelf = viewer ? (viewer.id === row.id || viewer.username.toLowerCase() === row.username.toLowerCase()) : false;
  let isFollowing = false;
  if (viewer && !isSelf) {
    const followCheck = await env.DB.prepare(
      'SELECT 1 FROM user_friends WHERE user_id = ? AND friend_id = ?'
    ).bind(viewer.id, row.id).first();
    isFollowing = Boolean(followCheck);
  }

  const isPrivate = row.is_private === 1;
  const canViewFollowers = !isPrivate || isSelf || isFollowing;

  // If public or permitted, load the following & followers list
  let followersList: any[] = [];
  let followingList: any[] = [];
  if (canViewFollowers) {
    const [fListRes, fwingListRes] = await Promise.all([
      env.DB.prepare(`
        SELECT u.id, u.username, u.display_name, COALESCE(u.selected_frame, 'default') as selected_frame
        FROM user_friends f JOIN users u ON f.user_id = u.id
        WHERE f.friend_id = ?
        ORDER BY u.display_name ASC LIMIT 50
      `).bind(row.id).all(),
      env.DB.prepare(`
        SELECT u.id, u.username, u.display_name, COALESCE(u.selected_frame, 'default') as selected_frame
        FROM user_friends f JOIN users u ON f.friend_id = u.id
        WHERE f.user_id = ?
        ORDER BY u.display_name ASC LIMIT 50
      `).bind(row.id).all(),
    ]);
    followersList = fListRes.results || [];
    followingList = fwingListRes.results || [];
  }

  const lvl = calculateLevel(row.xp || 0);
  const todayStr = getTodayUTC();
  const yesterdayStr = getYesterdayUTC();

  // Evaluate streaks: if consecutive day was missed, active streak resets to 0
  const evaluatedStreaks = (statsResult.results || []).map(s => {
    const { activeStreak, isMaintainedToday } = evaluateActiveStreak(s.last_daily_date, s.current_streak, todayStr, yesterdayStr);
    return {
      game_id: s.game_id,
      current_streak: activeStreak,
      best_streak: Math.max(s.best_streak || 0, activeStreak),
      is_streak_maintained_today: isMaintainedToday,
      last_daily_date: s.last_daily_date,
    };
  });

  return jsonResponse(
    {
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
        isPrivate,
        canViewFollowers,
        isFollowing,
        isSelf,
        followersCount: canViewFollowers ? (followersCount?.count || 0) : null,
        followingCount: canViewFollowers ? (followingCount?.count || 0) : null,
        followers: followersList,
        following: followingList,
        streaks: evaluatedStreaks,
      },
    },
    200,
    {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  );
}

// PUT /api/user/profile - Update user's about description, gamertag, and privacy option
export async function handleUpdateProfile(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: { displayName?: string; about?: string; isPrivate?: boolean | number };
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const newDisplayName = body.displayName?.trim() || null;
  const newAbout = body.about?.trim() || null;
  const newIsPrivate = body.isPrivate !== undefined ? (body.isPrivate ? 1 : 0) : null;

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
      is_private = COALESCE(?, is_private),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(newDisplayName, newAbout, newIsPrivate, user.id).run();

  const updatedUser = await env.DB.prepare(`
    SELECT id, username, display_name, about, coins, streak_count, COALESCE(is_private, 0) as is_private
    FROM users WHERE id = ?
  `).bind(user.id).first();

  return jsonResponse({
    success: true,
    message: 'Profile updated successfully!',
    user: updatedUser,
  });
}
