import { SeededRNG } from './prng.js';

export const WORD_LIST = [
  "APPLE", "BEACH", "BRAIN", "BREAD", "CHAIR", "CLOCK", "CLOUD", "DANCE",
  "DREAM", "DRIVE", "EARTH", "FLAME", "FRUIT", "GLASS", "GRAPE", "GREEN",
  "HEART", "HOUSE", "LIGHT", "MONEY", "MUSIC", "NIGHT", "OCEAN", "PARTY",
  "PLANT", "POWER", "RIVER", "SCENE", "SMILE", "SPACE", "STONE", "STORM",
  "TABLE", "TRAIN", "WATER", "WORLD", "YOUTH", "BRAVE", "SHARP", "SMART"
];

export const KB_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"]
];

/**
 * Validates a 5-letter guess against a target word.
 * Returns array of statuses: ['correct', 'present', 'absent', ...]
 */
export function evaluateWordleGuess(guess, targetWord) {
  const targetArr = targetWord.split("");
  const result = Array(5).fill("absent");
  const letterCounts = {};

  for (const char of targetArr) {
    letterCounts[char] = (letterCounts[char] || 0) + 1;
  }

  // First pass: mark correct positions
  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetArr[i]) {
      result[i] = "correct";
      letterCounts[guess[i]]--;
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < 5; i++) {
    if (result[i] !== "correct" && letterCounts[guess[i]] > 0) {
      result[i] = "present";
      letterCounts[guess[i]]--;
    }
  }

  return result;
}

export const gameConfig = {
  id: "wordle",
  title: "Wordle",
  description: "Guess the hidden 5-letter word in 6 attempts.",
  badge: "Free to Play",
  icon: "🔤",
  isFree: true,
  gameUnlockCost: 0,
  difficulties: {
    easy: {
      tier: "easy",
      unlockCost: 50,
      rewardCoins: 15,
      maxAttempts: 6,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:wordle:easy`);
        const wordIndex = rng.nextInt(0, WORD_LIST.length - 1);
        return {
          gameId: "wordle",
          difficulty: "easy",
          dateStr,
          wordLength: 5,
          maxAttempts: 6,
          targetWord: WORD_LIST[wordIndex]
        };
      }
    },
    medium: {
      tier: "medium",
      unlockCost: 150,
      rewardCoins: 35,
      maxAttempts: 5, // 5 attempts for medium
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:wordle:medium`);
        const wordIndex = rng.nextInt(0, WORD_LIST.length - 1);
        return {
          gameId: "wordle",
          difficulty: "medium",
          dateStr,
          wordLength: 5,
          maxAttempts: 5,
          targetWord: WORD_LIST[wordIndex]
        };
      }
    },
    hard: {
      tier: "hard",
      unlockCost: 300,
      rewardCoins: 75,
      maxAttempts: 4, // 4 attempts for hard
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`${dateStr}:wordle:hard`);
        const wordIndex = rng.nextInt(0, WORD_LIST.length - 1);
        return {
          gameId: "wordle",
          difficulty: "hard",
          dateStr,
          wordLength: 5,
          maxAttempts: 4,
          targetWord: WORD_LIST[wordIndex]
        };
      }
    }
  },
  unlimitedPlayground: {
    tier: "playground",
    unlockCost: 500,
    generateRandomPuzzle: () => {
      const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
      return {
        gameId: "wordle",
        difficulty: "playground",
        wordLength: 5,
        maxAttempts: 6,
        targetWord: randomWord
      };
    }
  }
};
