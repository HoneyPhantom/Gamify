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
  dateStr?: string; // YYYY-MM-DD UTC
}

export interface UserRow {
  id: string;
  username: string;
  display_name: string;
  pin_hash: string;
  pin_salt: string;
  coins: number;
  streak_count: number;
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
  updated_at: string;
}
