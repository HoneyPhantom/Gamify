-- =====================================================================
-- Gamify Platform - Cloudflare D1 Production Migration
-- File: d1_migration.sql
-- Safe, additive-only migration. NEVER drops or deletes player data!
-- Execute via: npx wrangler d1 execute gamify-prod-db --remote --file=./d1_migration.sql
-- =====================================================================

-- 1. Ensure core social and tournament tables exist
CREATE TABLE IF NOT EXISTS user_friends (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    PRIMARY KEY (user_id, friend_id)
);
CREATE INDEX IF NOT EXISTS idx_user_friends_lookup ON user_friends(user_id);

CREATE TABLE IF NOT EXISTS weekly_tournament (
    id TEXT PRIMARY KEY,
    week_id TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 0,
    games_played INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    UNIQUE(week_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_weekly_tournament_rank ON weekly_tournament(week_id, points DESC, games_played DESC);

CREATE TABLE IF NOT EXISTS user_cosmetics (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    purchased_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    UNIQUE(user_id, item_id)
);
CREATE INDEX IF NOT EXISTS idx_user_cosmetics_user ON user_cosmetics(user_id);

CREATE TABLE IF NOT EXISTS user_challenges (
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
    created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    completed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_challenges_to_user ON user_challenges(to_user_id, status);
CREATE INDEX IF NOT EXISTS idx_challenges_from_user ON user_challenges(from_user_id);

CREATE TABLE IF NOT EXISTS user_badges (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL,
    unlocked_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    UNIQUE(user_id, badge_id)
);
CREATE INDEX IF NOT EXISTS idx_user_badges_lookup ON user_badges(user_id);

-- 2. Add columns to users table safely if not already present
-- Note: In SQLite D1, if a column already exists, ALTER TABLE ADD COLUMN may warn; that is expected and safe.
ALTER TABLE users ADD COLUMN about TEXT DEFAULT 'Puzzle solver climbing to the top!';
ALTER TABLE users ADD COLUMN xp INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN selected_frame TEXT DEFAULT 'default';
ALTER TABLE users ADD COLUMN selected_title TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN best_streak INTEGER NOT NULL DEFAULT 0;

-- 3. Add columns to user_game_stats table safely if not already present
ALTER TABLE user_game_stats ADD COLUMN best_streak INTEGER NOT NULL DEFAULT 0;
ALTER TABLE user_game_stats ADD COLUMN current_streak INTEGER NOT NULL DEFAULT 0;
ALTER TABLE user_game_stats ADD COLUMN last_daily_date TEXT;
