import { SeededRNG } from './prng.js';

const EMOJI_POOLS = {
  easy: ['🍎', '🍌', '🍇', '🍓', '🥑', '🍉'],
  medium: ['🚀', '🛸', '🌍', '🌟', '🌕', '☄️', '🪐', '🛰️'],
  hard: ['🦁', '🐯', '🐼', '🐨', '🦊', '🐰', '🐸', '🐙', '🦄', '🐲'],
};

function generateMemoryPuzzle(rng, tier) {
  const pool = EMOJI_POOLS[tier] || EMOJI_POOLS.medium;
  const pairs = pool.map((emoji, idx) => ({ id: idx, emoji }));
  const deck = [...pairs, ...pairs.map(p => ({ ...p }))];
  const shuffled = rng.shuffle(deck.map((card, index) => ({
    uid: `${card.id}_${index}`,
    pairId: card.id,
    emoji: card.emoji,
  })));

  const columns = tier === 'easy' ? 4 : tier === 'medium' ? 4 : 5;
  const rows = tier === 'easy' ? 3 : tier === 'medium' ? 4 : 4;

  return {
    tier,
    rows,
    columns,
    totalPairs: pool.length,
    deck: shuffled,
  };
}

export const gameConfig = {
  id: 'memory-match',
  title: 'Memory Match',
  description: 'Flip cards and match all emoji pairs with fewest moves and fastest time!',
  badge: 'Brain Trainer',
  icon: '🃏',
  thumbnail: '/images/gamify-logo.png',
  isFree: false,
  gameUnlockCost: 150,

  difficulties: {
    easy: {
      unlockCost: 0,
      rewardCoins: 15,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`memory-easy-${dateStr}`);
        return generateMemoryPuzzle(rng, 'easy');
      },
    },
    medium: {
      unlockCost: 150,
      rewardCoins: 35,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`memory-med-${dateStr}`);
        return generateMemoryPuzzle(rng, 'medium');
      },
    },
    hard: {
      unlockCost: 300,
      rewardCoins: 75,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`memory-hard-${dateStr}`);
        return generateMemoryPuzzle(rng, 'hard');
      },
    },
  },

  unlimitedPlayground: {
    unlockCost: 500,
    generatePlaygroundPuzzle: () => {
      const rng = new SeededRNG(`memory-play-${Date.now()}-${Math.random()}`);
      return generateMemoryPuzzle(rng, 'medium');
    },
  },

  mount: (container, puzzle, callbacks) => {
    const { rows, columns, totalPairs, deck } = puzzle;
    let flippedIndices = [];
    const matchedPairIds = new Set();
    let moveCount = 0;
    let comboStreak = 0;
    let isLocked = false;
    let isFinished = false;

    callbacks.setRules(`
      <h3>Memory Match Rules:</h3>
      <p>1. Tap any face-down card to flip it over.</p>
      <p>2. Tap a second card to find its matching emoji pair.</p>
      <p>3. If they match, they stay face-up and grant bonus combo points! ⚡</p>
      <p>4. If they don't match, they flip back down.</p>
      <p>5. Find all <strong>${totalPairs} pairs</strong> to win!</p>
    `);

    container.innerHTML = `
      <div class="memory-wrapper" style="display:flex; flex-direction:column; align-items:center; gap:0.85rem; width:100%; user-select:none;">
        <div class="memory-stats-bar" style="display:flex; justify-content:space-between; width:100%; max-width:440px; font-size:0.85rem; font-weight:700; color:var(--text-muted); padding:0.4rem 0.8rem; background:#f8fafc; border:1px solid var(--border-color); border-radius:8px;">
          <div>Pairs: <span id="memory-pairs-count" style="color:var(--accent);">0/${totalPairs}</span></div>
          <div>Moves: <span id="memory-moves-count" style="color:#0f172a;">0</span></div>
          <div id="memory-combo-indicator" style="color:#f59e0b; display:none;">Combo 1× 🔥</div>
        </div>

        <div id="memory-board" style="
          display: grid;
          grid-template-columns: repeat(${columns}, 1fr);
          gap: 10px;
          max-width: 440px;
          width: 100%;
          perspective: 1000px;
          padding: 8px;
        ">
          ${deck.map((card, i) => `
            <div class="memory-card" data-index="${i}" data-pair="${card.pairId}" style="
              aspect-ratio: 1;
              position: relative;
              cursor: pointer;
              transform-style: preserve-3d;
              transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            ">
              <div class="card-face card-back" style="
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                background: linear-gradient(135deg, #0284c7, #38bdf8);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: #ffffff;
                box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2);
                border: 2px solid #bae6fd;
              ">✨</div>
              <div class="card-face card-front" style="
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                transform: rotateY(180deg);
                background: #ffffff;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.2rem;
                border: 2px solid #cbd5e1;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
              ">${card.emoji}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const boardEl = container.querySelector('#memory-board');
    const pairsCountEl = container.querySelector('#memory-pairs-count');
    const movesCountEl = container.querySelector('#memory-moves-count');
    const comboIndicatorEl = container.querySelector('#memory-combo-indicator');
    const cardEls = container.querySelectorAll('.memory-card');

    function updateStatsUI() {
      if (pairsCountEl) pairsCountEl.textContent = `${matchedPairIds.size}/${totalPairs}`;
      if (movesCountEl) movesCountEl.textContent = moveCount;
      if (comboIndicatorEl) {
        if (comboStreak > 1) {
          comboIndicatorEl.textContent = `Combo ${comboStreak}× 🔥`;
          comboIndicatorEl.style.display = 'block';
        } else {
          comboIndicatorEl.style.display = 'none';
        }
      }
    }

    cardEls.forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        if (isLocked || isFinished) return;
        const index = parseInt(cardEl.dataset.index, 10);
        const card = deck[index];

        // Check if already matched or already flipped
        if (matchedPairIds.has(card.pairId)) return;
        if (flippedIndices.includes(index)) return;

        // Flip card
        cardEl.style.transform = 'rotateY(180deg)';
        flippedIndices.push(index);

        if (flippedIndices.length === 2) {
          moveCount++;
          isLocked = true;
          updateStatsUI();

          const [firstIdx, secondIdx] = flippedIndices;
          const firstCard = deck[firstIdx];
          const secondCard = deck[secondIdx];

          if (firstCard.pairId === secondCard.pairId) {
            // Match found!
            matchedPairIds.add(firstCard.pairId);
            comboStreak++;
            updateStatsUI();

            const firstEl = cardEls[firstIdx];
            const secondEl = cardEls[secondIdx];
            const front1 = firstEl.querySelector('.card-front');
            const front2 = secondEl.querySelector('.card-front');

            if (front1) {
              front1.style.borderColor = '#22c55e';
              front1.style.background = '#f0fdf4';
            }
            if (front2) {
              front2.style.borderColor = '#22c55e';
              front2.style.background = '#f0fdf4';
            }

            flippedIndices = [];
            isLocked = false;

            // Check Win
            if (matchedPairIds.size === totalPairs) {
              isFinished = true;
              const baseScore = puzzle.tier === 'easy' ? 400 : puzzle.tier === 'medium' ? 650 : 900;
              const efficiencyBonus = Math.max(0, (totalPairs * 2 - moveCount) * 20);
              const totalScore = baseScore + efficiencyBonus;

              callbacks.showStatus(`🎉 Memory Master! All ${totalPairs} pairs matched in ${moveCount} moves!`, 'var(--correct-bg)');
              setTimeout(() => {
                callbacks.onWin(totalScore);
              }, 700);
            }
          } else {
            // Mismatch
            comboStreak = 0;
            updateStatsUI();
            setTimeout(() => {
              const firstEl = cardEls[firstIdx];
              const secondEl = cardEls[secondIdx];
              if (firstEl) firstEl.style.transform = 'rotateY(0deg)';
              if (secondEl) secondEl.style.transform = 'rotateY(0deg)';
              flippedIndices = [];
              isLocked = false;
            }, 850);
          }
        }
      });
    });

    return () => {
      // Cleanup
    };
  },
};
