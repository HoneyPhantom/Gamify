import { Env } from '../types';

let schemaReady = false;

/**
 * Self-healing D1 Database Schema Initializer.
 * Ensures all required tables and indexes exist on the very first query
 * so that missing CLI migrations never trigger "no such table: users".
 */
export async function ensureDbSchema(env: Env): Promise<void> {
  if (schemaReady) return;

  // List of idempotent DDL statements
  const ddlStatements = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      about TEXT NOT NULL DEFAULT 'Puzzle solver climbing to the top!',
      pin_hash TEXT NOT NULL,
      pin_salt TEXT NOT NULL,
      coins INTEGER NOT NULL DEFAULT 100,
      streak_count INTEGER NOT NULL DEFAULT 0,
      last_played_date TEXT,
      last_login_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);`,
    `CREATE TABLE IF NOT EXISTS user_game_unlocks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      game_id TEXT NOT NULL,
      game_unlocked INTEGER NOT NULL DEFAULT 0,
      easy_unlocked INTEGER NOT NULL DEFAULT 0,
      medium_unlocked INTEGER NOT NULL DEFAULT 0,
      hard_unlocked INTEGER NOT NULL DEFAULT 0,
      playground_unlocked INTEGER NOT NULL DEFAULT 0,
      unlocked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, game_id)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_user_game_unlocks_lookup ON user_game_unlocks(user_id, game_id);`,
    `CREATE TABLE IF NOT EXISTS user_game_stats (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      game_id TEXT NOT NULL,
      total_score INTEGER NOT NULL DEFAULT 0,
      plays_count INTEGER NOT NULL DEFAULT 0,
      best_score INTEGER NOT NULL DEFAULT 0,
      best_streak INTEGER NOT NULL DEFAULT 0,
      current_streak INTEGER NOT NULL DEFAULT 0,
      last_daily_date TEXT,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, game_id)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_user_game_stats_game ON user_game_stats(game_id, plays_count);`,
    `CREATE TABLE IF NOT EXISTS daily_completions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      game_id TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard', 'playground')),
      played_date TEXT NOT NULL,
      coins_awarded INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, game_id, difficulty, played_date)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_daily_completions_lookup ON daily_completions(user_id, game_id, difficulty, played_date);`,
    `CREATE TABLE IF NOT EXISTS daily_leaderboard (
      id TEXT PRIMARY KEY,
      game_id TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard')),
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      time_taken_ms INTEGER NOT NULL,
      played_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(game_id, difficulty, user_id, played_date)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_daily_leaderboard_rank ON daily_leaderboard(game_id, difficulty, played_date, score DESC, time_taken_ms ASC);`,
    `CREATE TABLE IF NOT EXISTS user_friends (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      friend_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, friend_id)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_user_friends_lookup ON user_friends(user_id);`,
    `CREATE TABLE IF NOT EXISTS user_badges (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      badge_id TEXT NOT NULL,
      unlocked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, badge_id)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_user_badges_lookup ON user_badges(user_id);`,
    `CREATE TABLE IF NOT EXISTS weekly_tournament (
      id TEXT PRIMARY KEY,
      week_id TEXT NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      points INTEGER NOT NULL DEFAULT 0,
      games_played INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(week_id, user_id)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_weekly_tournament_rank ON weekly_tournament(week_id, points DESC, games_played DESC);`,
    `CREATE TABLE IF NOT EXISTS user_cosmetics (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      item_id TEXT NOT NULL,
      item_type TEXT NOT NULL,
      purchased_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, item_id)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_user_cosmetics_user ON user_cosmetics(user_id);`,
    `CREATE TABLE IF NOT EXISTS user_challenges (
      id TEXT PRIMARY KEY,
      from_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      to_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      game_id TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      target_score INTEGER NOT NULL,
      challenger_time_ms INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      opponent_score INTEGER DEFAULT 0,
      opponent_time_ms INTEGER DEFAULT 0,
      winner_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT
    );`,
    `CREATE INDEX IF NOT EXISTS idx_challenges_to_user ON user_challenges(to_user_id, status);`,
    `CREATE INDEX IF NOT EXISTS idx_challenges_from_user ON user_challenges(from_user_id);`
  ];

  for (const statement of ddlStatements) {
    try {
      await env.DB.prepare(statement).run();
    } catch (err: any) {
      console.warn('[D1 Schema Init Warning]', err?.message || err);
    }
  }

  // Safe migrations for pre-existing tables in production
  const safeMigrations = [
    `ALTER TABLE users ADD COLUMN about TEXT DEFAULT 'Puzzle solver climbing to the top!'`,
    `ALTER TABLE users ADD COLUMN xp INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN selected_frame TEXT DEFAULT 'default'`,
    `ALTER TABLE users ADD COLUMN selected_title TEXT DEFAULT ''`,
    `ALTER TABLE user_game_stats ADD COLUMN best_streak INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE user_game_stats ADD COLUMN current_streak INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE user_game_stats ADD COLUMN last_daily_date TEXT`,
  ];

  for (const migration of safeMigrations) {
    try {
      await env.DB.prepare(migration).run();
    } catch {}
  }

  // Recalibrate any streak counts artificially inflated by unlimited playground plays
  try {
    await env.DB.prepare(`
      UPDATE user_game_stats
      SET 
        best_streak = COALESCE((
          SELECT COUNT(DISTINCT played_date) 
          FROM daily_completions 
          WHERE daily_completions.user_id = user_game_stats.user_id 
            AND daily_completions.game_id = user_game_stats.game_id
        ), 0),
        current_streak = COALESCE((
          SELECT COUNT(DISTINCT played_date) 
          FROM daily_completions 
          WHERE daily_completions.user_id = user_game_stats.user_id 
            AND daily_completions.game_id = user_game_stats.game_id
        ), 0)
      WHERE best_streak > COALESCE((
        SELECT COUNT(DISTINCT played_date) 
        FROM daily_completions 
        WHERE daily_completions.user_id = user_game_stats.user_id 
          AND daily_completions.game_id = user_game_stats.game_id
      ), 0)
    `).run();
  } catch {}

  // Ensure Wordle playground is unlocked for all users
  try {
    await env.DB.prepare("UPDATE user_game_unlocks SET playground_unlocked = 1 WHERE game_id = 'wordle'").run();
  } catch {}

  schemaReady = true;
}
