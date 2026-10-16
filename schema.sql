-- =====================================================================
-- Gamify Platform - Cloudflare D1 (SQLite) Production Migration Schema
-- File: schema.sql
-- =====================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------
-- 1. Users Table
-- Core profile, wallet balances, streak state, and audit timestamps.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,                             -- Generated UUIDv4 or 'usr_' prefixed ID
    google_uid TEXT NOT NULL UNIQUE,                 -- Google Subject claim (sub)
    email TEXT NOT NULL UNIQUE,                      -- User Google account email
    display_name TEXT NOT NULL,                      -- Display name for leaderboards
    avatar_url TEXT,                                 -- Profile image URL
    coins INTEGER NOT NULL DEFAULT 100,              -- Initial starting economy balance
    streak_count INTEGER NOT NULL DEFAULT 0,         -- Consecutive active daily puzzle streaks
    last_played_date TEXT,                           -- ISO-8601 calendar date YYYY-MM-DD (UTC)
    created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_uid ON users(google_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ---------------------------------------------------------------------
-- 2. User Game Unlocks Table
-- Tracks unlocked difficulty tiers & playground mode per user per game.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_game_unlocks (
    id TEXT PRIMARY KEY,                             -- Composite or UUID: e.g., 'usr_123#number-grid'
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,                           -- Slug: 'number-grid', 'word-flow', etc.
    easy_unlocked INTEGER NOT NULL DEFAULT 1,        -- Easy tier is unlocked by default (1=true, 0=false)
    medium_unlocked INTEGER NOT NULL DEFAULT 0,      -- Locked initially
    hard_unlocked INTEGER NOT NULL DEFAULT 0,        -- Locked initially
    playground_unlocked INTEGER NOT NULL DEFAULT 0,  -- Requires easy, medium & hard first
    unlocked_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    UNIQUE(user_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_user_game_unlocks_lookup ON user_game_unlocks(user_id, game_id);

-- ---------------------------------------------------------------------
-- 3. User Game Stats / Running Aggregates Table
-- Real-time running score sum, count, and personal best to eliminate
-- bloated historical play logs while enabling O(1) average calculation.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_game_stats (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    total_score INTEGER NOT NULL DEFAULT 0,          -- SUM(scores) across all completed runs
    plays_count INTEGER NOT NULL DEFAULT 0,          -- COUNT(*) of valid completed runs
    best_score INTEGER NOT NULL DEFAULT 0,           -- MAX(score) recorded
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    PRIMARY KEY (user_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_user_game_stats_game_plays 
ON user_game_stats(game_id, plays_count) 
WHERE plays_count >= 20;

-- ---------------------------------------------------------------------
-- 4. Daily Puzzle Completions Table (Idempotency & Rewards Ledger)
-- Enforces strictly-once coin rewards per calendar date per tier.
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
-- Tracks today's puzzle performance. Indexed for blazing fast rank queries.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_leaderboard (
    id TEXT PRIMARY KEY,                             -- UUID or deterministic hash
    game_id TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard')),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,                          -- Lower or higher depending on game scoring
    time_taken_ms INTEGER NOT NULL,                  -- Completion duration in milliseconds
    played_date TEXT NOT NULL,                       -- YYYY-MM-DD (UTC)
    created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    UNIQUE(game_id, difficulty, user_id, played_date)
);

-- Fast ranking index for daily standings
CREATE INDEX IF NOT EXISTS idx_daily_leaderboard_rank 
ON daily_leaderboard(game_id, difficulty, played_date, score ASC, time_taken_ms ASC);
