import { Env } from '../types';

let schemaReady = false;

/**
 * Self-healing D1 Database Schema Initializer.
 * Ensures all required tables and indexes exist on the very first query
 * so that missing CLI migrations never trigger "no such table: users".
 */
export async function ensureDbSchema(env: Env): Promise<void> {
  if (schemaReady) return;

  try {
    // Check if users table exists with modern schema
    await env.DB.prepare('SELECT id, username, pin_hash, coins FROM users LIMIT 1').first();
    schemaReady = true;
    return;
  } catch {
    // Table is missing or has old legacy schema
  }

  // List of idempotent DDL statements
  const ddlStatements = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      pin_hash TEXT NOT NULL,
      pin_salt TEXT NOT NULL,
      coins INTEGER NOT NULL DEFAULT 100,
      streak_count INTEGER NOT NULL DEFAULT 0,
      last_played_date TEXT,
      last_login_at TEXT NOT NULL DEFAULT (DATETIME('now')),
      created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
      updated_at TEXT NOT NULL DEFAULT (DATETIME('now'))
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
      unlocked_at TEXT NOT NULL DEFAULT (DATETIME('now')),
      updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
      UNIQUE(user_id, game_id)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_user_game_unlocks_lookup ON user_game_unlocks(user_id, game_id);`,
    `CREATE TABLE IF NOT EXISTS user_game_stats (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      game_id TEXT NOT NULL,
      total_score INTEGER NOT NULL DEFAULT 0,
      plays_count INTEGER NOT NULL DEFAULT 0,
      best_score INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
      PRIMARY KEY (user_id, game_id)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_user_game_stats_game_plays ON user_game_stats(game_id, plays_count) WHERE plays_count >= 20;`,
    `CREATE TABLE IF NOT EXISTS daily_completions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      game_id TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard', 'playground')),
      played_date TEXT NOT NULL,
      coins_awarded INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT NOT NULL DEFAULT (DATETIME('now')),
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
      created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
      UNIQUE(game_id, difficulty, user_id, played_date)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_daily_leaderboard_rank ON daily_leaderboard(game_id, difficulty, played_date, score DESC, time_taken_ms ASC);`
  ];

  for (const statement of ddlStatements) {
    try {
      await env.DB.prepare(statement).run();
    } catch (err: any) {
      console.warn('[D1 Schema Init Warning]', err?.message || err);
    }
  }

  schemaReady = true;
}
