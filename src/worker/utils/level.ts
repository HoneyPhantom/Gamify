/**
 * XP & Level progression calculations
 * Level formula: Math.floor(Math.sqrt(xp / 25)) + 1
 */

export interface LevelInfo {
  level: number;
  currentXp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  title: string;
}

export const LEVEL_TITLES = [
  { minLevel: 1, title: 'Novice Solver' },
  { minLevel: 3, title: 'Apprentice' },
  { minLevel: 5, title: 'Puzzle Solver' },
  { minLevel: 8, title: 'Tactician' },
  { minLevel: 12, title: 'Master Mind' },
  { minLevel: 18, title: 'Grandmaster' },
  { minLevel: 25, title: 'Legendary Sage' },
];

export function calculateLevel(xp: number): LevelInfo {
  const safeXp = Math.max(0, xp || 0);
  const level = Math.floor(Math.sqrt(safeXp / 25)) + 1;
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 25;
  const xpForNextLevel = Math.pow(level, 2) * 25;

  let title = 'Novice Solver';
  for (const t of LEVEL_TITLES) {
    if (level >= t.minLevel) title = t.title;
  }

  return {
    level,
    currentXp: safeXp,
    xpForCurrentLevel,
    xpForNextLevel,
    title,
  };
}
