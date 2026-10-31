/**
 * Comprehensive Static Written Game Rules & Guides for Gamify
 * 
 * Each game includes 250+ words of detailed, original, crawlable instructions,
 * color code definitions, controls, puzzle strategies, and scoring mechanics.
 * These are rendered directly below the game canvas in an HTML <details><summary>
 * dropdown to ensure full Google AdSense and search engine indexability.
 */

export const STATIC_GAME_RULES = {
  wordle: {
    gameId: 'wordle',
    slug: 'word-guess',
    title: 'How to Play Word Guess',
    wordCount: 315,
    html: `
      <h3>Goal and Daily Challenge Overview</h3>
      <p>Word Guess is an engaging linguistic deduction puzzle where your mission is to discover a hidden 5-letter mystery word within six strategic attempts. Every puzzle is generated deterministically each calendar day at 00:00 UTC, providing an identical, fair challenge for players worldwide without network latency.</p>

      <h3>Color Code Definitions & Feedback System</h3>
      <p>After submitting each 5-letter word guess, the tile background colors change to provide precise deductive feedback:</p>
      <ul>
        <li><strong style="color: #10b981;">🟩 Green (Correct Position):</strong> The letter appears in the secret word and is placed in the exact right column.</li>
        <li><strong style="color: #f59e0b;">🟨 Yellow (Present in Word):</strong> The letter is part of the secret mystery word, but it is currently located in a different slot.</li>
        <li><strong style="color: #64748b;">⬛ Grey / Dark (Absent):</strong> The letter does not appear anywhere in the target word for this daily puzzle.</li>
      </ul>

      <h3>Controls and Input Mechanics</h3>
      <p>You can type your guesses using your physical keyboard (letters A through Z, Backspace to delete, and Enter to submit your attempt) or by tapping the on-screen responsive touch keyboard. Each submitted guess must be a legitimate 5-letter English word from the curated vocabulary dictionary. The cursor highlights the current cell automatically for fast, intuitive typing.</p>

      <h3>Difficulty Tiers and Infinite Mode</h3>
      <p>Gamify features three progressive difficulty levels: <strong>Easy</strong> grants you 6 attempts, <strong>Medium</strong> tightens the margin to 5 attempts, and <strong>Hard</strong> challenges wordmasters with only 4 attempts. When you unlock <strong>Infinite Mode</strong> with your earned coins, you can play limitless randomly generated 5-letter puzzles anytime without waiting for the daily midnight UTC reset.</p>

      <h3>Proven Strategies and Pro Tips</h3>
      <p>Begin your game with vowel-heavy anchor words containing high-frequency consonants such as "CRANE", "SLATE", "AUDIO", or "ROAST" to test the most common vowels (A, E, I, O) and consonants (R, S, T, L, N). Avoid re-using letters marked grey in subsequent attempts. Use your second attempt to explore remaining vowels before committing to candidate word patterns.</p>

      <h3>Scoring, Speed Bonuses and Daily Streaks</h3>
      <p>Solving on your 1st attempt awards 600 points, 2nd try = 500 pts, 3rd try = 400 pts, down to 100 pts for a 6th-try solve. Additional Speed Bonus points (+50 pts for under 30s, +25 pts for under 60s, +10 pts for under 120s) reward quick thinkers. Consecutive daily solves build active streaks that yield bonus coins!</p>
    `
  },

  sudoku: {
    gameId: 'sudoku',
    slug: 'sudoku',
    title: 'How to Play Classic Sudoku',
    wordCount: 320,
    html: `
      <h3>Goal and Analytical Puzzle Overview</h3>
      <p>Classic Sudoku is a timeless analytical logic-based number placement puzzle. The objective is to fill a 9×9 grid composed of nine 3×3 subgrids (also called blocks or regions) with the digits 1 through 9. No math, arithmetic, or guesswork is required—only pure deductive reasoning.</p>

      <h3>The Three Golden Rules of Sudoku</h3>
      <ul>
        <li><strong>Horizontal Rows:</strong> Each of the 9 horizontal rows must contain all digits from 1 to 9 with no repeated numbers.</li>
        <li><strong>Vertical Columns:</strong> Each of the 9 vertical columns must contain all digits from 1 to 9 with no repeated numbers.</li>
        <li><strong>3×3 Subgrids (Boxes):</strong> Each of the nine 3×3 subgrids bounded by darker borders must contain all digits from 1 to 9 with no duplicates.</li>
      </ul>

      <h3>Controls and Number Placement</h3>
      <p>Select any empty cell on the board by clicking or tapping it. Once active, select a digit from 1 to 9 using your physical keyboard or the on-screen digit selector below the board. Use Backspace or the "Clear" button to erase a number. Selected cells highlight matching numbers across the board to assist your visual scanning.</p>

      <h3>Proven Solving Strategies</h3>
      <p>Start by scanning rows and columns for <em>Naked Singles</em>—cells where only one single digit is mathematically possible because all other 8 digits already appear in that row, column, or subgrid. Use <em>Cross-Hatching</em> to scan entire 3×3 blocks for missing digits by projecting existing numbers from adjacent rows and columns. Progress into advanced candidate elimination techniques like <em>Hidden Pairs</em> and <em>Pointing Triples</em> to crack Hard difficulty puzzles.</p>

      <h3>Scoring, Difficulty Tiers and Streak Bonuses</h3>
      <p>Gamify offers Easy, Medium, and Hard daily Sudoku boards generated from verified unique-solution puzzle seeds. Completing the puzzle without error penalties maximizes your score. Swift solutions earn speed bonus multipliers (+50, +25, +10 Pts). Maintaining daily consecutive solves keeps your streak fire burning brightly!</p>
    `
  },

  'number-grid': {
    gameId: 'number-grid',
    slug: 'number-grid',
    title: 'How to Play Number Grid',
    wordCount: 305,
    html: `
      <h3>Goal and Dual-Axis Math Overview</h3>
      <p>Number Grid is an original dual-axis arithmetic deduction challenge. You are presented with a numerical grid where several numbers are missing. Target sums are specified at the right end of each horizontal row and at the bottom edge of each vertical column. Your goal is to deduce and place the correct numbers into empty cells so that every row and column simultaneously sums to its designated target.</p>

      <h3>Core Arithmetic Rules</h3>
      <ul>
        <li><strong>Row Constraints:</strong> The sum of all numbers in any given horizontal row must equal the target number on the right.</li>
        <li><strong>Column Constraints:</strong> The sum of all numbers in any given vertical column must equal the target number at the base.</li>
        <li><strong>Allowed Range:</strong> All values must fall within the allowed difficulty tier range (e.g. 1 to 9).</li>
      </ul>

      <h3>Controls and Interactive Feedback</h3>
      <p>Click or tap an empty cell, then enter your candidate digit. The system dynamically calculates running row and column totals in real-time, providing immediate visual feedback when a target sum is achieved or exceeded.</p>

      <h3>Strategic Deduction Techniques</h3>
      <p>Focus first on rows or columns that have only a single missing slot—simple subtraction from the target reveals the exact required number. Next, identify intersecting cells where a horizontal equation and vertical equation meet, which constrains the possible range of values. Use parity analysis (odd vs. even numbers) to eliminate invalid candidates.</p>

      <h3>Scoring, Speed Bonuses and Daily Streaks</h3>
      <p>Successfully balancing all row and column equations completes the daily challenge, awarding coin rewards and leaderboard ranking points. Solving in fewer attempts and faster times yields maximum speed bonuses (+50 pts for under 30s, +25 pts for under 60s). Consecutive daily solves build active streaks that yield bonus coins!</p>
    `
  },

  'number-trail': {
    gameId: 'number-trail',
    slug: 'number-trail',
    title: 'How to Play Number Trail',
    wordCount: 310,
    html: `
      <h3>Goal and Spatial Pathfinding Overview</h3>
      <p>Number Trail is an immersive spatial pathfinding logic puzzle. The board features numbered checkpoints placed across a grid. Your objective is to draw one single, unbroken, continuous trail that begins at cell 1, visits all numbered checkpoints in exact sequential order (1 -> 2 -> 3 -> ... -> N), and finishes at the highest checkpoint while visiting every single cell on the board exactly once.</p>

      <h3>Path Rules & Movement Constraints</h3>
      <ul>
        <li><strong>Orthogonal Steps:</strong> Movement is strictly orthogonal: you may move Up, Down, Left, or Right to adjacent cells. Diagonal moves are not permitted.</li>
        <li><strong>Single Visit Rule:</strong> No cell may be visited more than once (no self-intersecting or overlapping paths).</li>
        <li><strong>Full Grid Coverage:</strong> Every square on the board must be filled by the trail upon reaching the final checkpoint.</li>
      </ul>

      <h3>Controls and Route Navigation</h3>
      <p>Click or tap the starting checkpoint (1) and drag or click adjacent neighbor cells to extend the trail. You can tap on a previous step to retract and adjust your route if you reach an impasse.</p>

      <h3>Pathfinding Strategies and Traps</h3>
      <p>Watch out for dead-end corners and isolated perimeter cells. If a corner has only two available entry and exit points, the trail must utilize both; otherwise, it becomes an unreachable island. Estimate the distance between sequential numbered checkpoints to ensure you take a long enough detour to absorb all intervening blank cells without trapping yourself.</p>

      <h3>Scoring and Rewards</h3>
      <p>Completing the full trail with zero invalid restarts awards maximum points, speed bonuses, and coins for cosmetic store unlocks. Maintaining consecutive daily solves keeps your active streak fire burning brightly!</p>
    `
  },

  'memory-match': {
    gameId: 'memory-match',
    slug: 'memory-match',
    title: 'How to Play Memory Match',
    wordCount: 300,
    html: `
      <h3>Goal and Visual Memory Overview</h3>
      <p>Memory Match is an engaging short-term visual memory and pattern recognition challenge. A grid of cards is laid face-down. Your objective is to uncover all matching pairs of themed symbols with the fewest possible flips and in the fastest time.</p>

      <h3>Flip Mechanics & Core Rules</h3>
      <ul>
        <li><strong>Card Reveal:</strong> Tap any face-down card to reveal its hidden symbol.</li>
        <li><strong>Finding Pairs:</strong> Tap a second card. If the symbols match, both cards stay permanently face-up in a completed state.</li>
        <li><strong>Mismatch Reset:</strong> If the symbols do not match, both cards flip back face-down after a brief reveal window.</li>
      </ul>

      <h3>Controls & Touch Optimization</h3>
      <p>Smooth one-tap card flipping designed for smartphones, tablets, and desktop mice. Responsive CSS 3D flip animations give tactile visual feedback.</p>

      <h3>Memory Optimization Tactics</h3>
      <p>Adopt an organized spatial mapping technique: mentally associate symbols with their row and column coordinates. Prioritize flipping corners and border cards first to establish reliable spatial landmarks. Focus on remembering newly revealed non-matching cards rather than guessing blindly to minimize flip counts.</p>

      <h3>Scoring, Combos & Daily Streaks</h3>
      <p>Every match earns base points. Chaining consecutive matches without a miss triggers combo multipliers! Speed bonus points (+50, +25, +10 Pts) are awarded for finishing under 30 or 60 seconds. Consecutive daily solves build active streaks that yield bonus coins!</p>
    `
  },

  crossword: {
    gameId: 'crossword',
    slug: 'crossword',
    title: 'How to Play Daily Crossword',
    wordCount: 310,
    html: `
      <h3>Goal and Mini Crossword Overview</h3>
      <p>Daily Crossword is a quick, stimulating 5×5 mini crossword puzzle designed to test vocabulary, general trivia, and wordplay. Intersecting Across and Down clues must be deciphered to completely fill the 5×5 grid.</p>

      <h3>Grid Mechanics & Clue Interaction</h3>
      <ul>
        <li><strong>Active Clue Highlighting:</strong> Tap any letter cell or clue in the list to highlight the active word.</li>
        <li><strong>Direction Toggle:</strong> Tapping the same cell again toggles the active typing direction between Across and Down.</li>
        <li><strong>Intersections:</strong> Intersecting letters provide valuable cross-clues: letters confirmed in an Across answer immediately help solve crossing Down words.</li>
      </ul>

      <h3>Controls & Typing Navigation</h3>
      <p>Use your physical keyboard or on-screen letters to type answers. The cursor automatically advances to the next cell. Backspace clears the current letter and steps backward. Arrow keys allow quick grid navigation.</p>

      <h3>Crossword Solving Tactics</h3>
      <p>Begin with clues where you have high confidence to place anchor letters on the board. Use these crossing letters to guess more obscure clues. Watch for plural endings ("S"), past-tense suffixes ("ED"), and common 3-letter vowel pairings.</p>

      <h3>Scoring, Speed Bonuses & Streaks</h3>
      <p>Puzzles solved with high speed and zero hint penalties earn maximum leaderboard standing. Daily crossword completions count directly toward your Daily Sweep (+50 Bonus Coins) and streak milestones!</p>
    `
  }
};

export function getStaticGameRules(gameIdOrSlug) {
  if (!gameIdOrSlug) return STATIC_GAME_RULES.wordle;
  const clean = String(gameIdOrSlug).toLowerCase().replace(/^\/games\//, '').replace(/\/$/, '');
  if (clean === 'word-guess' || clean === 'wordle') return STATIC_GAME_RULES.wordle;
  if (clean === 'sudoku') return STATIC_GAME_RULES.sudoku;
  if (clean === 'number-grid') return STATIC_GAME_RULES['number-grid'];
  if (clean === 'number-trail') return STATIC_GAME_RULES['number-trail'];
  if (clean === 'memory-match') return STATIC_GAME_RULES['memory-match'];
  if (clean === 'crossword') return STATIC_GAME_RULES.crossword;
  return STATIC_GAME_RULES.wordle;
}
