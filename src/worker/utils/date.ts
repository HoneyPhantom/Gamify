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
 * Evaluates active streak for display/querying.
 * If consecutive day was missed (lastDate < yesterday), active streak resets to 0.
 */
export function evaluateActiveStreak(
  lastDate: string | null,
  storedCount: number,
  todayStr: string = getTodayUTC(),
  yesterdayStr: string = getYesterdayUTC()
): { activeStreak: number; isMaintainedToday: boolean } {
  if (!lastDate || storedCount <= 0) {
    return { activeStreak: 0, isMaintainedToday: false };
  }

  if (lastDate === todayStr) {
    return { activeStreak: storedCount, isMaintainedToday: true };
  }

  if (lastDate === yesterdayStr) {
    return { activeStreak: storedCount, isMaintainedToday: false };
  }

  // Missed one or more days: active streak resets to 0
  return { activeStreak: 0, isMaintainedToday: false };
}

/**
 * Calculates next streak count based on user's last played date when submitting a score.
 * Only requires: last_played_date, current_streak, and today's date.
 */
export function calculateNextStreak(
  lastPlayedDate: string | null,
  currentStreak: number,
  todayStr: string = getTodayUTC()
): number {
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

  // Missed one or more days, start new streak of 1
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
