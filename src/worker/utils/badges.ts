import { Env } from '../types';

export interface BadgeDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const BADGES: Record<string, BadgeDefinition> = {
  wordsmith: {
    id: 'wordsmith',
    name: 'Wordsmith',
    icon: '🧠',
    description: 'Solve 5 Wordle puzzles',
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    icon: '⚡',
    description: 'Solve any daily puzzle in under 30 seconds',
  },
  inferno: {
    id: 'inferno',
    name: 'Inferno',
    icon: '🔥',
    description: 'Reach a 3-day streak on any game or account',
  },
  triple_crown: {
    id: 'triple_crown',
    name: 'Triple Crown',
    icon: '🏆',
    description: 'Complete the Daily Sweep (all 3 games in one day)',
  },
  diamond_mind: {
    id: 'diamond_mind',
    name: 'Diamond Mind',
    icon: '💎',
    description: 'Accumulate 300 or more coins',
  },
  perfectionist: {
    id: 'perfectionist',
    name: 'Perfectionist',
    icon: '🎯',
    description: 'Solve Wordle in 3 or fewer attempts',
  },
  pathfinder: {
    id: 'pathfinder',
    name: 'Pathfinder',
    icon: '🗺️',
    description: 'Solve 5 Number Trail puzzles',
  },
  social_butterfly: {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    icon: '👥',
    description: 'Connect with a friend on Gamify',
  },
};

export interface BadgeContext {
  gameId?: string;
  difficulty?: string;
  timeTakenMs?: number;
  wordleTries?: number;
  streak?: number;
  currentCoins?: number;
  dailySweepCompleted?: boolean;
}

/**
 * Checks all badge criteria for a user and unlocks any newly earned badges.
 * Returns array of newly unlocked badge objects.
 */
export async function checkAndAwardBadges(
  env: Env,
  userId: string,
  ctx: BadgeContext = {}
): Promise<BadgeDefinition[]> {
  try {
    // 1. Fetch user's currently unlocked badges
    const existingBadgesRes = await env.DB.prepare(
      'SELECT badge_id FROM user_badges WHERE user_id = ?'
    ).bind(userId).all<{ badge_id: string }>();

    const existingBadgeIds = new Set((existingBadgesRes.results || []).map(b => b.badge_id));
    const newlyEarnedBadges: BadgeDefinition[] = [];

    // Helper to evaluate and queue a badge unlock
    const qualify = (badgeId: string, isQualified: boolean) => {
      if (isQualified && !existingBadgeIds.has(badgeId) && BADGES[badgeId]) {
        newlyEarnedBadges.push(BADGES[badgeId]);
        existingBadgeIds.add(badgeId);
      }
    };

    // 2. Evaluate context-driven badges
    if (ctx.timeTakenMs && ctx.timeTakenMs < 30000) {
      qualify('speed_demon', true);
    }

    if (ctx.streak && ctx.streak >= 3) {
      qualify('inferno', true);
    }

    if (ctx.currentCoins && ctx.currentCoins >= 300) {
      qualify('diamond_mind', true);
    }

    if (ctx.dailySweepCompleted) {
      qualify('triple_crown', true);
    }

    if (ctx.gameId === 'wordle' && ctx.wordleTries && ctx.wordleTries <= 3) {
      qualify('perfectionist', true);
    }

    // 3. Evaluate aggregate-driven badges (games count, friends count)
    // A. Wordsmith (5 Wordle plays)
    if (!existingBadgeIds.has('wordsmith')) {
      const wordleStats = await env.DB.prepare(
        "SELECT plays_count FROM user_game_stats WHERE user_id = ? AND game_id = 'wordle'"
      ).bind(userId).first<{ plays_count: number }>();
      if (wordleStats && wordleStats.plays_count >= 5) {
        qualify('wordsmith', true);
      }
    }

    // B. Pathfinder (5 Number Trail plays)
    if (!existingBadgeIds.has('pathfinder')) {
      const trailStats = await env.DB.prepare(
        "SELECT plays_count FROM user_game_stats WHERE user_id = ? AND game_id = 'number-trail'"
      ).bind(userId).first<{ plays_count: number }>();
      if (trailStats && trailStats.plays_count >= 5) {
        qualify('pathfinder', true);
      }
    }

    // C. Social Butterfly (>= 1 friend)
    if (!existingBadgeIds.has('social_butterfly')) {
      const friendsCount = await env.DB.prepare(
        'SELECT COUNT(*) as count FROM user_friends WHERE user_id = ?'
      ).bind(userId).first<{ count: number }>();
      if (friendsCount && friendsCount.count >= 1) {
        qualify('social_butterfly', true);
      }
    }

    // 4. Persist newly unlocked badges to user_badges table
    if (newlyEarnedBadges.length > 0) {
      const stmts = newlyEarnedBadges.map(badge =>
        env.DB.prepare(
          'INSERT OR IGNORE INTO user_badges (id, user_id, badge_id, unlocked_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
        ).bind(`ub_${userId}_${badge.id}`, userId, badge.id)
      );
      await env.DB.batch(stmts);
    }

    return newlyEarnedBadges;
  } catch (err) {
    console.warn('[checkAndAwardBadges warning]', err);
    return [];
  }
}
