/**
 * Environment bindings and Database Types for Cloudflare Worker
 */

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  ENVIRONMENT?: string;
  ASSETS?: Fetcher;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  displayName: string;
}

export type UnlockTarget = 'game' | 'easy' | 'medium' | 'hard' | 'playground';
export type DifficultyTier = 'easy' | 'medium' | 'hard' | 'playground';

export interface RegisterRequestBody {
  username: string;
  displayName: string;
  pin: string;
}

export interface LoginRequestBody {
  username: string;
  pin: string;
}

export interface UnlockRequestBody {
  gameId: string;
  tier: UnlockTarget;
}

export interface SubmitScoreRequestBody {
  gameId: string;
  difficulty: DifficultyTier;
  score: number;
  timeTakenMs: number;
  wordleTries?: number;
  dateStr?: string; // YYYY-MM-DD UTC
}

export interface UserRow {
  id: string;
  username: string;
  display_name: string;
  about?: string;
  pin_hash: string;
  pin_salt: string;
  coins: number;
  streak_count: number;
  xp?: number;
  selected_frame?: string;
  selected_title?: string;
  last_played_date: string | null;
  last_login_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserGameUnlockRow {
  id: string;
  user_id: string;
  game_id: string;
  game_unlocked: number;
  easy_unlocked: number;
  medium_unlocked: number;
  hard_unlocked: number;
  playground_unlocked: number;
  unlocked_at: string;
  updated_at: string;
}

export interface UserGameStatsRow {
  user_id: string;
  game_id: string;
  total_score: number;
  plays_count: number;
  best_score: number;
  best_streak?: number;
  current_streak?: number;
  last_daily_date?: string | null;
  updated_at: string;
}

export interface UserFriendRow {
  user_id: string;
  friend_id: string;
  created_at: string;
}

export interface PublicGameStreak {
  game_id: string;
  best_streak: number;
  current_streak: number;
}

export interface UserBadgeRow {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
}

export interface PublicUserProfile {
  id?: string;
  username: string;
  displayName?: string;
  gamertag?: string;
  about: string;
  streaks?: PublicGameStreak[];
  badges?: string[];
  xp?: number;
  level?: number;
  levelTitle?: string;
  selectedFrame?: string;
  selectedTitle?: string;
  activityHistory?: Record<string, number>;
}

export interface WeeklyTournamentRow {
  id: string;
  week_id: string;
  user_id: string;
  points: number;
  games_played: number;
  updated_at: string;
}

export interface UserCosmeticRow {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  purchased_at: string;
}

export interface UserChallengeRow {
  id: string;
  from_user_id: string;
  to_user_id: string;
  game_id: string;
  difficulty: string;
  target_score: number;
  challenger_time_ms: number;
  status: 'pending' | 'completed' | 'declined';
  opponent_score?: number;
  opponent_time_ms?: number;
  winner_user_id?: string | null;
  created_at: string;
  completed_at?: string | null;
}


