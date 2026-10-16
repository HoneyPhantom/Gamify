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
