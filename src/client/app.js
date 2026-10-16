import { getDailyPuzzle, getPlaygroundPuzzle, getTodayDateStr } from '../games/index.js';
import { api } from './api.js';

let currentTier = 'easy';
let currentPuzzle = null;
let startTime = Date.now();
let userUnlocks = { easy_unlocked: 1, medium_unlocked: 0, hard_unlocked: 0, playground_unlocked: 0 };

const puzzleContainer = document.getElementById('puzzle-container');
const feedbackMsg = document.getElementById('feedback-msg');
const unlockBtn = document.getElementById('unlock-btn');
const validateBtn = document.getElementById('validate-btn');
const coinBalanceEl = document.getElementById('coin-balance');
const streakCountEl = document.getElementById('streak-count');

function isTierUnlocked(tier) {
  if (tier === 'easy') return true;
  return userUnlocks[`${tier}_unlocked`] === 1;
}

function loadPuzzle(tier) {
  currentTier = tier;
  feedbackMsg.textContent = '';
  const dateStr = getTodayDateStr();

  if (!isTierUnlocked(tier)) {
    puzzleContainer.innerHTML = `
      <div style="padding: 2.5rem; text-align: center; color: var(--text-muted); border: 1px dashed var(--border); border-radius: 8px;">
        🔒 <strong>Tier Locked</strong><br/>
        This tier requires unlocking before access.
      </div>
    `;
    unlockBtn.style.display = 'inline-block';
    unlockBtn.textContent = `Unlock ${tier.toUpperCase()}`;
    validateBtn.style.display = 'none';
    return;
  }

  unlockBtn.style.display = 'none';
  validateBtn.style.display = 'inline-block';

  // Instant zero-worker client-side generation
  if (tier === 'playground') {
    currentPuzzle = getPlaygroundPuzzle('number-grid', 4);
  } else {
    currentPuzzle = getDailyPuzzle('number-grid', tier, dateStr);
  }

  startTime = Date.now();
  renderGrid(currentPuzzle);
}

function renderGrid(puzzle) {
  const { size, initialGrid, rowTargets, colTargets } = puzzle;
  
  // Matrix has size + 1 columns and size + 1 rows (extra row/col for targets)
  let html = `<div class="matrix-grid" style="grid-template-columns: repeat(${size + 1}, 48px);">`;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const val = initialGrid[r][c];
      if (val !== null) {
        html += `<div class="matrix-cell" style="opacity: 0.85;">${val}</div>`;
      } else {
        html += `
          <div class="matrix-cell">
            <input type="number" min="1" max="${puzzle.maxVal}" class="matrix-input" data-row="${r}" data-col="${c}" />
          </div>`;
      }
    }
    // Row target column
    html += `<div class="matrix-cell target">→ ${rowTargets[r]}</div>`;
  }

  // Column target row
  for (let c = 0; c < size; c++) {
    html += `<div class="matrix-cell target">↓ ${colTargets[c]}</div>`;
  }
  html += `<div class="matrix-cell target">★</div></div>`;

  puzzleContainer.innerHTML = html;
}

function readUserGrid() {
  const size = currentPuzzle.size;
  const grid = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      const fixedVal = currentPuzzle.initialGrid[r][c];
      if (fixedVal !== null) {
        row.push(fixedVal);
      } else {
        const input = puzzleContainer.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
        row.push(input && input.value ? parseInt(input.value, 10) : 0);
      }
    }
    grid.push(row);
  }
  return grid;
}

// Tier Switch Tab Listeners
document.querySelectorAll('.tab-btn[data-tier]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn[data-tier]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadPuzzle(btn.dataset.tier);
  });
});

// Unlock Tier Action
unlockBtn.addEventListener('click', async () => {
  try {
    feedbackMsg.style.color = 'var(--accent)';
    feedbackMsg.textContent = `Unlocking ${currentTier}...`;
    const res = await api.unlockTier('number-grid', currentTier);
    userUnlocks = res.unlocks;
    coinBalanceEl.textContent = res.remainingCoins;
    feedbackMsg.style.color = 'var(--success)';
    feedbackMsg.textContent = res.message;
    loadPuzzle(currentTier);
  } catch (err) {
    feedbackMsg.style.color = 'var(--danger)';
    feedbackMsg.textContent = err.message;
  }
});

// Validate & Submit Score Action
validateBtn.addEventListener('click', async () => {
  const userGrid = readUserGrid();
  const isValid = currentPuzzle.validate(userGrid);

  if (!isValid) {
    feedbackMsg.style.color = 'var(--danger)';
    feedbackMsg.textContent = '❌ Solution incorrect! Check target sums.';
    return;
  }

  const timeTakenMs = Date.now() - startTime;
  const baseScore = currentPuzzle.size * 1000;
  const timeBonus = Math.max(0, 5000 - Math.floor(timeTakenMs / 10));
  const finalScore = baseScore + timeBonus;

  feedbackMsg.style.color = 'var(--success)';
  feedbackMsg.textContent = `🎉 Solved correctly in ${(timeTakenMs / 1000).toFixed(1)}s! Submitting...`;

  try {
    const res = await api.submitScore({
      gameId: 'number-grid',
      difficulty: currentTier,
      score: finalScore,
      timeTakenMs,
      dateStr: getTodayDateStr(),
    });

    coinBalanceEl.textContent = res.currentCoins;
    streakCountEl.textContent = res.streakCount;
    feedbackMsg.textContent = `🏆 Score recorded (${finalScore} pts)! ${res.coinsAwarded > 0 ? `+${res.coinsAwarded} Coins Earned!` : 'Daily puzzle already completed today.'}`;
    loadLeaderboard();
  } catch (err) {
    feedbackMsg.style.color = 'var(--warning)';
    feedbackMsg.textContent = `Validated locally! (Server: ${err.message})`;
  }
});

async function loadLeaderboard() {
  const view = document.getElementById('leaderboard-view');
  try {
    const data = await api.getLeaderboard('number-grid');
    renderLeaderboardView(data);
  } catch {
    view.innerHTML = '<p style="color: var(--text-muted);">Leaderboard currently offline.</p>';
  }
}

function renderLeaderboardView(data) {
  const view = document.getElementById('leaderboard-view');
  const isGlobal = document.getElementById('btn-global-tab').classList.contains('active');

  if (isGlobal) {
    const rows = data.globalLeaderboard || [];
    if (!rows.length) {
      view.innerHTML = '<p style="color: var(--text-muted);">No global ranks yet (requires 20+ completed games).</p>';
      return;
    }
    view.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr><th>Rank</th><th>Player</th><th>Avg Score</th><th>Total Plays</th><th>Best</th></tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr>
              <td>#${i + 1}</td>
              <td>${r.display_name}</td>
              <td><strong>${r.global_average_score}</strong></td>
              <td>${r.plays_count}</td>
              <td>${r.best_score}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  } else {
    const rows = data.dailyLeaderboard || [];
    if (!rows.length) {
      view.innerHTML = '<p style="color: var(--text-muted);">No daily entries recorded yet today. Be the first!</p>';
      return;
    }
    view.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr><th>Rank</th><th>Player</th><th>Tier</th><th>Score</th><th>Time</th></tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr>
              <td>#${i + 1}</td>
              <td>${r.display_name}</td>
              <td>${r.difficulty}</td>
              <td><strong>${r.score}</strong></td>
              <td>${(r.time_taken_ms / 1000).toFixed(1)}s</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  }
}

document.getElementById('btn-daily-tab').addEventListener('click', (e) => {
  e.target.classList.add('active');
  document.getElementById('btn-global-tab').classList.remove('active');
  loadLeaderboard();
});

document.getElementById('btn-global-tab').addEventListener('click', (e) => {
  e.target.classList.add('active');
  document.getElementById('btn-daily-tab').classList.remove('active');
  loadLeaderboard();
});

// Initial boot
loadPuzzle('easy');
loadLeaderboard();
