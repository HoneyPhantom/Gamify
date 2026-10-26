/**
 * Calendar Date & Streak Calculation Utilities (UTC Strict)
 */

export function getTodayUTC(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getYesterdayUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
}

/**
 * Calculates next streak count based on user's last played date
 */
export function calculateNextStreak(lastPlayedDate: string | null, currentStreak: number, todayStr: string): number {
  if (!lastPlayedDate) {
    return 1;
  }

  if (lastPlayedDate === todayStr) {
    // Already played today, maintain streak
    return currentStreak > 0 ? currentStreak : 1;
  }

  const yesterdayStr = getYesterdayUTC();
  if (lastPlayedDate === yesterdayStr) {
    // Played yesterday, increment streak
    return currentStreak + 1;
  }

  // Missed one or more days, reset streak to 1
  return 1;
}

/**
 * Returns UTC week identifier in 'YYYY-Www' format (e.g. '2026-W43')
 */
export function getWeekIdUTC(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

