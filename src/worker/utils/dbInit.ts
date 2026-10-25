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
    `CREATE INDEX IF NOT EXISTS idx_user_friends_lookup ON user_friends(user_id);`
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
    `ALTER TABLE user_game_stats ADD COLUMN best_streak INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE user_game_stats ADD COLUMN current_streak INTEGER NOT NULL DEFAULT 0`,
  ];

  for (const migration of safeMigrations) {
    try {
      await env.DB.prepare(migration).run();
    } catch {}
  }

  // Ensure Wordle playground is unlocked for all users
  try {
    await env.DB.prepare("UPDATE user_game_unlocks SET playground_unlocked = 1 WHERE game_id = 'wordle'").run();
  } catch {}

  schemaReady = true;
}
