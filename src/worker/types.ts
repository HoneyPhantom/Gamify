/**
 * Environment bindings and Database Types for Cloudflare Worker
 */

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  ENVIRONMENT?: string;
  ASSETS?: Fetcher;
}

export interface AuthenticatedUser {
  id: string;
  googleUid: string;
  email: string;
  displayName: string;
}

export type DifficultyTier = 'easy' | 'medium' | 'hard' | 'playground';

export interface UnlockRequestBody {
  gameId: string;
  tier: DifficultyTier;
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
  google_uid: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  coins: number;
  streak_count: number;
  last_played_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserGameUnlockRow {
  id: string;
  user_id: string;
  game_id: string;
  easy_unlocked: number;
  medium_unlocked: number;
  hard_unlocked: number;
  playground_unlocked: number;
  unlocked_at: string;
}

export interface UserGameStatsRow {
  user_id: string;
  game_id: string;
  total_score: number;
  plays_count: number;
  best_score: number;
  updated_at: string;
}
