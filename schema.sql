-- =====================================================================
-- Gamify Platform - Cloudflare D1 (SQLite) Production Migration Schema
-- File: schema.sql
-- =====================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------
-- 1. Users Table
-- Custom 4-digit PIN authentication credentials, wallet, and streaks.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,                             -- 'usr_' prefixed unique identifier
    username TEXT NOT NULL UNIQUE,                   -- Unique handle (lowercase)
    display_name TEXT NOT NULL,                      -- Public leaderboard display name
    pin_hash TEXT NOT NULL,                          -- PBKDF2-SHA256 salted hash of 4-digit PIN
    pin_salt TEXT NOT NULL,                          -- Cryptographic random salt (hex string)
    coins INTEGER NOT NULL DEFAULT 100,              -- Initial starter balance (100 coins)
    streak_count INTEGER NOT NULL DEFAULT 0,         -- Consecutive active daily puzzle streaks
    last_played_date TEXT,                           -- ISO-8601 calendar date YYYY-MM-DD (UTC)
    last_login_at TEXT NOT NULL DEFAULT (DATETIME('now')), -- Tracks session issuance
    created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ---------------------------------------------------------------------
-- 2. User Game Unlocks Table
-- Tracks base game unlock & difficulty tiers per user per game.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_game_unlocks (
    id TEXT PRIMARY KEY,                             -- Composite: 'usr_xxx#gameId'
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,                           -- 'wordle', 'number-grid', etc.
    game_unlocked INTEGER NOT NULL DEFAULT 0,        -- Base game access (1=unlocked, 0=locked)
    easy_unlocked INTEGER NOT NULL DEFAULT 0,        -- Tier access
    medium_unlocked INTEGER NOT NULL DEFAULT 0,
    hard_unlocked INTEGER NOT NULL DEFAULT 0,
    playground_unlocked INTEGER NOT NULL DEFAULT 0,  -- Requires easy, medium & hard first
    unlocked_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    UNIQUE(user_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_user_game_unlocks_lookup ON user_game_unlocks(user_id, game_id);

-- ---------------------------------------------------------------------
-- 3. User Game Stats / Running Aggregates Table
-- Running score sum and count to avoid storing historical play rows.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_game_stats (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    total_score INTEGER NOT NULL DEFAULT 0,          -- SUM(score)
    plays_count INTEGER NOT NULL DEFAULT 0,          -- COUNT(*)
    best_score INTEGER NOT NULL DEFAULT 0,           -- MAX(score)
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    PRIMARY KEY (user_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_user_game_stats_game_plays 
ON user_game_stats(game_id, plays_count) 
WHERE plays_count >= 20;

-- ---------------------------------------------------------------------
-- 4. Daily Puzzle Completions Table (Idempotency Ledger)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_completions (
    id TEXT PRIMARY KEY,                             -- 'cmp_' || user_id || '_' || game_id || '_' || difficulty || '_' || played_date
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard', 'playground')),
    played_date TEXT NOT NULL,                       -- YYYY-MM-DD format (UTC)
    coins_awarded INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    UNIQUE(user_id, game_id, difficulty, played_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_completions_lookup 
ON daily_completions(user_id, game_id, difficulty, played_date);

-- ---------------------------------------------------------------------
-- 5. Daily Leaderboard Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_leaderboard (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard')),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    time_taken_ms INTEGER NOT NULL,
    played_date TEXT NOT NULL,                       -- YYYY-MM-DD (UTC)
    created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    UNIQUE(game_id, difficulty, user_id, played_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_leaderboard_rank 
ON daily_leaderboard(game_id, difficulty, played_date, score DESC, time_taken_ms ASC);

-- ---------------------------------------------------------------------
-- 6. User Badges / Achievements Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_badges (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL,
    unlocked_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_lookup ON user_badges(user_id);

-- ---------------------------------------------------------------------
-- 7. Weekly Tournaments Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weekly_tournament (
    id TEXT PRIMARY KEY,
    week_id TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 0,
    games_played INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    UNIQUE(week_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_weekly_tournament_rank 
ON weekly_tournament(week_id, points DESC, games_played DESC);

-- ---------------------------------------------------------------------
-- 8. User Cosmetics Inventory Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_cosmetics (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    purchased_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    UNIQUE(user_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_user_cosmetics_user ON user_cosmetics(user_id);

-- ---------------------------------------------------------------------
-- 9. User PvP Challenges Table
-- ---------------------------------------------------------------------
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



