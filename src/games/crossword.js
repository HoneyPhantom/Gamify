import { SeededRNG } from './prng.js';

const PUZZLE_BANK = {
  easy: [
    {
      id: 'e1',
      title: 'Kingdom & Earth',
      grid: [
        ['B', 'E', 'A', 'S', 'T'],
        ['E', 'A', 'R', 'T', 'H'],
        ['A', 'R', 'M', 'O', 'R'],
        ['S', 'T', 'O', 'N', 'E'],
        ['T', 'H', 'R', 'E', 'E'],
      ],
      across: [
        { num: 1, row: 0, col: 0, word: 'BEAST', clue: 'A ferocious wild creature' },
        { num: 2, row: 1, col: 0, word: 'EARTH', clue: 'Our home blue planet' },
        { num: 3, row: 2, col: 0, word: 'ARMOR', clue: 'Protective suit worn by medieval knights' },
        { num: 4, row: 3, col: 0, word: 'STONE', clue: 'Hard rock found on the trail' },
        { num: 5, row: 4, col: 0, word: 'THREE', clue: 'A crowd, according to an old saying' },
      ],
      down: [
        { num: 1, row: 0, col: 0, word: 'BEAST', clue: 'Fairy tale partner of Beauty' },
        { num: 2, row: 0, col: 1, word: 'EARTH', clue: 'Rich soil or third planet from the sun' },
        { num: 3, row: 0, col: 2, word: 'ARMOR', clue: 'Shields and metal protective gear' },
        { num: 4, row: 0, col: 3, word: 'STONE', clue: 'Skipping pebble on a smooth lake' },
        { num: 5, row: 0, col: 4, word: 'THREE', clue: 'Number of strikes before an out' },
      ],
    },
    {
      id: 'e2',
      title: 'Spring Season',
      grid: [
        ['A', 'P', 'R', 'I', 'L'],
        ['P', 'L', 'A', 'C', 'E'],
        ['R', 'A', 'P', 'I', 'D'],
        ['I', 'C', 'I', 'N', 'G'],
        ['L', 'E', 'D', 'G', 'E'],
      ],
      across: [
        { num: 1, row: 0, col: 0, word: 'APRIL', clue: 'Spring month famous for rain showers' },
        { num: 2, row: 1, col: 0, word: 'PLACE', clue: 'A specific spot, seat, or location' },
        { num: 3, row: 2, col: 0, word: 'RAPID', clue: 'Moving with extreme quickness' },
        { num: 4, row: 3, col: 0, word: 'ICING', clue: 'Sweet, creamy frosting on a birthday cake' },
        { num: 5, row: 4, col: 0, word: 'LEDGE', clue: 'Narrow shelf protruding from a canyon wall' },
      ],
      down: [
        { num: 1, row: 0, col: 0, word: 'APRIL', clue: 'Fourth month of the calendar year' },
        { num: 2, row: 0, col: 1, word: 'PLACE', clue: 'To put or position an object' },
        { num: 3, row: 0, col: 2, word: 'RAPID', clue: 'Fast-flowing whitewater river section' },
        { num: 4, row: 0, col: 3, word: 'ICING', clue: 'Hockey infraction or decorative glaze' },
        { num: 5, row: 0, col: 4, word: 'LEDGE', clue: 'Window sill or narrow shelf' },
      ],
    },
    {
      id: 'e3',
      title: 'Peaceful Evening',
      grid: [
        ['A', 'R', 'O', 'S', 'E'],
        ['R', 'E', 'L', 'A', 'X'],
        ['O', 'L', 'I', 'V', 'E'],
        ['S', 'A', 'V', 'O', 'R'],
        ['E', 'X', 'E', 'R', 'T'],
      ],
      across: [
        { num: 1, row: 0, col: 0, word: 'AROSE', clue: 'Got out of bed with the morning sun' },
        { num: 2, row: 1, col: 0, word: 'RELAX', clue: 'Unwind and take a deep breath' },
        { num: 3, row: 2, col: 0, word: 'OLIVE', clue: 'Small green fruit famous for savory oil' },
        { num: 4, row: 3, col: 0, word: 'SAVOR', clue: 'Appreciate good food or wine slowly' },
        { num: 5, row: 4, col: 0, word: 'EXERT', clue: 'Apply physical or mental power' },
      ],
      down: [
        { num: 1, row: 0, col: 0, word: 'AROSE', clue: 'Came into existence or ascended' },
        { num: 2, row: 0, col: 1, word: 'RELAX', clue: 'Chill out beside the pool' },
        { num: 3, row: 0, col: 2, word: 'OLIVE', clue: 'Classic garnish on a pizza or martini' },
        { num: 4, row: 0, col: 3, word: 'SAVOR', clue: 'Treasure every single moment' },
        { num: 5, row: 0, col: 4, word: 'EXERT', clue: 'Put forth immense energy' },
      ],
    },
  ],
  medium: [
    {
      id: 'm1',
      title: 'Starry Orbit',
      grid: [
        ['C', 'O', 'A', 'S', 'T'],
        ['O', 'R', 'B', 'I', 'T'],
        ['A', 'B', 'A', 'T', 'E'],
        ['S', 'I', 'T', 'E', 'S'],
        ['T', 'T', 'E', 'S', 'T'],
      ],
      across: [
        { num: 1, row: 0, col: 0, word: 'COAST', clue: 'Where golden sands meet ocean waves' },
        { num: 2, row: 1, col: 0, word: 'ORBIT', clue: 'Gravitational circular flight around Earth' },
        { num: 3, row: 2, col: 0, word: 'ABATE', clue: 'Subside or lessen in intensity' },
        { num: 4, row: 3, col: 0, word: 'SITES', clue: 'Locations on the World Wide Web' },
        { num: 5, row: 4, col: 0, word: 'TTEST', clue: 'Statistical difference assessment in science' },
      ],
      down: [
        { num: 1, row: 0, col: 0, word: 'COAST', clue: 'Sail smoothly along without pedaling' },
        { num: 2, row: 0, col: 1, word: 'ORBIT', clue: 'Planetary track around the sun' },
        { num: 3, row: 0, col: 2, word: 'ABATE', clue: 'Fade into tranquil calm' },
        { num: 4, row: 0, col: 3, word: 'SITES', clue: 'Excavation grounds or web addresses' },
        { num: 5, row: 0, col: 4, word: 'TTEST', clue: 'Math comparison of sample averages' },
      ],
    },
    {
      id: 'm2',
      title: 'Stage & Story',
      grid: [
        ['S', 'C', 'E', 'N', 'E'],
        ['C', 'O', 'V', 'E', 'R'],
        ['E', 'V', 'E', 'R', 'Y'],
        ['N', 'E', 'R', 'V', 'E'],
        ['E', 'R', 'Y', 'E', 'D'],
      ],
      across: [
        { num: 1, row: 0, col: 0, word: 'SCENE', clue: 'Part of an act in theater or cinema' },
        { num: 2, row: 1, col: 0, word: 'COVER', clue: 'Front jacket of a bestseller novel' },
        { num: 3, row: 2, col: 0, word: 'EVERY', clue: 'Each single individual in a group' },
        { num: 4, row: 3, col: 0, word: 'NERVE', clue: 'Audacious courage under pressure' },
        { num: 5, row: 4, col: 0, word: 'ERYED', clue: 'Having an eerie or haunted look' },
      ],
      down: [
        { num: 1, row: 0, col: 0, word: 'SCENE', clue: 'Setting of a dramatic film shoot' },
        { num: 2, row: 0, col: 1, word: 'COVER', clue: 'Protective umbrella or book binding' },
        { num: 3, row: 0, col: 2, word: 'EVERY', clue: 'All without a single exception' },
        { num: 4, row: 0, col: 3, word: 'NERVE', clue: 'Biological impulse transmitter' },
        { num: 5, row: 0, col: 4, word: 'ERYED', clue: 'Mysterious and otherworldly' },
      ],
    },
  ],
  hard: [
    {
      id: 'h1',
      title: 'Royal Enigma',
      grid: [
        ['C', 'R', 'O', 'W', 'N'],
        ['R', 'A', 'D', 'A', 'R'],
        ['O', 'D', 'O', 'R', 'S'],
        ['W', 'A', 'R', 'E', 'D'],
        ['N', 'R', 'S', 'D', 'Y'],
      ],
      across: [
        { num: 1, row: 0, col: 0, word: 'CROWN', clue: 'Jeweled headwear of kings and queens' },
        { num: 2, row: 1, col: 0, word: 'RADAR', clue: 'Radio wave detection scanner (palindrome)' },
        { num: 3, row: 2, col: 0, word: 'ODORS', clue: 'Scents, perfumes, or potent aromas' },
        { num: 4, row: 3, col: 0, word: 'WARED', clue: 'Cautiously mindful and on alert' },
        { num: 5, row: 4, col: 0, word: 'NRSDY', clue: 'Early childhood preschool room (abbr.)' },
      ],
      down: [
        { num: 1, row: 0, col: 0, word: 'CROWN', clue: 'The supreme pinnacle or royal tiara' },
        { num: 2, row: 0, col: 1, word: 'RADAR', clue: 'Aircraft tracking echo device' },
        { num: 3, row: 0, col: 2, word: 'ODORS', clue: 'Olfactory sensations' },
        { num: 4, row: 0, col: 3, word: 'WARED', clue: 'Heeded an advance warning' },
        { num: 5, row: 0, col: 4, word: 'NRSDY', clue: 'Kindergarten playspace' },
      ],
    },
    {
      id: 'h2',
      title: 'Mind Labyrinth',
      grid: [
        ['S', 'H', 'A', 'R', 'P'],
        ['H', 'O', 'U', 'S', 'E'],
        ['A', 'U', 'D', 'I', 'T'],
        ['R', 'S', 'I', 'N', 'G'],
        ['P', 'E', 'T', 'G', 'Y'],
      ],
      across: [
        { num: 1, row: 0, col: 0, word: 'SHARP', clue: 'Having a keen slicing edge or quick intellect' },
        { num: 2, row: 1, col: 0, word: 'HOUSE', clue: 'A cozy home or legislative assembly' },
        { num: 3, row: 2, col: 0, word: 'AUDIT', clue: 'Formal accounting verification of finances' },
        { num: 4, row: 3, col: 0, word: 'RSING', clue: 'Ascending upward to the heights' },
        { num: 5, row: 4, col: 0, word: 'PETGY', clue: 'Pampered like a favorite companion' },
      ],
      down: [
        { num: 1, row: 0, col: 0, word: 'SHARP', clue: 'Musical pitch raised half a step (♯)' },
        { num: 2, row: 0, col: 1, word: 'HOUSE', clue: 'Shelter under a shingled roof' },
        { num: 3, row: 0, col: 2, word: 'AUDIT', clue: 'Thorough review of corporate books' },
        { num: 4, row: 0, col: 3, word: 'RSING', clue: 'Soaring high into the sky' },
        { num: 5, row: 0, col: 4, word: 'PETGY', clue: 'Treated with tender affection' },
      ],
    },
  ],
};

function getCrosswordPuzzle(rng, tier) {
  const bank = PUZZLE_BANK[tier] || PUZZLE_BANK.medium;
  const idx = rng.nextInt(0, bank.length);
  return {
    tier,
    ...bank[idx],
  };
}

export const gameConfig = {
  id: 'crossword',
  title: 'Crossword',
  description: 'Solve the daily 5x5 mini crossword with intersecting Across & Down clues!',
  badge: 'Word Puzzle',
  icon: '📝',
  thumbnail: '/images/crossword.png',
  isFree: false,
  gameUnlockCost: 150,

  difficulties: {
    easy: {
      unlockCost: 0,
      rewardCoins: 15,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`crossword-easy-${dateStr}`);
        return getCrosswordPuzzle(rng, 'easy');
      },
    },
    medium: {
      unlockCost: 150,
      rewardCoins: 35,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`crossword-med-${dateStr}`);
        return getCrosswordPuzzle(rng, 'medium');
      },
    },
    hard: {
      unlockCost: 300,
      rewardCoins: 75,
      generateDailyPuzzle: (dateStr) => {
        const rng = new SeededRNG(`crossword-hard-${dateStr}`);
        return getCrosswordPuzzle(rng, 'hard');
      },
    },
  },

  unlimitedPlayground: {
    unlockCost: 250,
    generatePlaygroundPuzzle: (tier = 'medium') => {
      const rng = new SeededRNG(`crossword-play-${Date.now()}-${Math.random()}`);
      return getCrosswordPuzzle(rng, tier);
    },
  },

  mount: (container, puzzle, callbacks) => {
    const { grid, across, down, title } = puzzle;
    const userGrid = Array.from({ length: 5 }, () => Array(5).fill(''));
    let activeRow = 0;
    let activeCol = 0;
    let activeDirection = 'across'; // 'across' or 'down'
    let isFinished = false;

    callbacks.setRules(`
      <h3>Mini Crossword Rules:</h3>
      <p>1. Fill the <strong>5×5 letter grid</strong> with intersecting words.</p>
      <p>2. Tap a cell or clue to toggle between <strong>Across</strong> & <strong>Down</strong>.</p>
      <p>3. Type using your physical keyboard or the on-screen keypad.</p>
      <p>4. Use Backspace to delete and arrow keys to navigate.</p>
      <p>5. Complete all words correctly to claim victory!</p>
    `);

    container.innerHTML = `
      <div class="crossword-wrapper" style="display:flex; flex-direction:column; align-items:center; gap:0.85rem; width:100%; max-width:480px; margin:0 auto; user-select:none;">
        
        <!-- Active Clue Pill Header -->
        <div id="cw-active-clue-banner" style="width:100%; padding:0.65rem 1rem; background:linear-gradient(135deg, #0284c7, #2563eb); color:#fff; border-radius:12px; font-size:0.88rem; font-weight:700; display:flex; justify-content:space-between; align-items:center; box-shadow:0 3px 10px rgba(37,99,235,0.25); cursor:pointer;">
          <div style="display:flex; align-items:center; gap:0.5rem; overflow:hidden;">
            <span id="cw-clue-badge" style="background:rgba(255,255,255,0.25); padding:2px 8px; border-radius:6px; font-size:0.75rem; text-transform:uppercase;">1-ACROSS</span>
            <span id="cw-clue-text" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Tap to switch direction</span>
          </div>
          <span style="opacity:0.85; font-size:0.8rem;">⟳ Toggle</span>
        </div>

        <!-- 5x5 Crossword Grid -->
        <div id="cw-grid-container" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px; width:100%; max-width:320px; aspect-ratio:1/1; background:#0f172a; padding:8px; border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,0.18);">
          ${Array.from({ length: 25 }, (_, idx) => {
            const r = Math.floor(idx / 5);
            const c = idx % 5;
            const cellNum = (c === 0) ? `${r + 1}` : '';
            return `
              <div class="cw-cell" data-row="${r}" data-col="${c}" style="position:relative; width:100%; height:100%; background:#ffffff; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:900; font-size:1.45rem; color:#0f172a; transition:background 0.15s, transform 0.15s;">
                <span style="position:absolute; top:2px; left:4px; font-size:0.65rem; color:#94a3b8; font-weight:700; pointer-events:none;">${cellNum}</span>
                <span class="cw-cell-letter" id="cw-cell-${r}-${c}"></span>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Clue List Accordion / Tabs -->
        <div style="width:100%; background:#f8fafc; border:1px solid var(--border-color); border-radius:14px; padding:0.75rem 1rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.4rem;">
            <div style="font-size:0.8rem; font-weight:800; color:#2563eb; text-transform:uppercase;">Across Clues</div>
            <div style="font-size:0.8rem; font-weight:800; color:#7c3aed; text-transform:uppercase;">Down Clues</div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.78rem; max-height:140px; overflow-y:auto;">
            <div id="cw-across-list" style="display:flex; flex-direction:column; gap:0.35rem;">
              ${across.map(clue => `
                <div class="cw-clue-item" data-dir="across" data-row="${clue.row}" data-col="${clue.col}" style="cursor:pointer; padding:3px 6px; border-radius:6px; line-height:1.3;">
                  <strong>${clue.num}A.</strong> ${clue.clue}
                </div>
              `).join('')}
            </div>
            <div id="cw-down-list" style="display:flex; flex-direction:column; gap:0.35rem;">
              ${down.map(clue => `
                <div class="cw-clue-item" data-dir="down" data-row="${clue.row}" data-col="${clue.col}" style="cursor:pointer; padding:3px 6px; border-radius:6px; line-height:1.3;">
                  <strong>${clue.num}D.</strong> ${clue.clue}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- On-Screen Virtual Keyboard -->
        <div id="cw-keyboard" style="display:flex; flex-direction:column; gap:5px; width:100%; max-width:440px; margin-top:0.25rem;">
          <div style="display:flex; justify-content:center; gap:4px;">
            ${['Q','W','E','R','T','Y','U','I','O','P'].map(k => `
              <button type="button" class="cw-key" data-key="${k}" style="flex:1; height:42px; border:none; border-radius:6px; background:#e2e8f0; font-weight:800; font-size:0.95rem; cursor:pointer;">${k}</button>
            `).join('')}
          </div>
          <div style="display:flex; justify-content:center; gap:4px;">
            ${['A','S','D','F','G','H','J','K','L'].map(k => `
              <button type="button" class="cw-key" data-key="${k}" style="flex:1; height:42px; border:none; border-radius:6px; background:#e2e8f0; font-weight:800; font-size:0.95rem; cursor:pointer;">${k}</button>
            `).join('')}
          </div>
          <div style="display:flex; justify-content:center; gap:4px;">
            <button type="button" class="cw-key-dir" id="cw-btn-switch-dir" style="flex:1.4; height:42px; border:none; border-radius:6px; background:#93c5fd; color:#1e3a8a; font-weight:800; font-size:0.8rem; cursor:pointer;">ACROSS</button>
            ${['Z','X','C','V','B','N','M'].map(k => `
              <button type="button" class="cw-key" data-key="${k}" style="flex:1; height:42px; border:none; border-radius:6px; background:#e2e8f0; font-weight:800; font-size:0.95rem; cursor:pointer;">${k}</button>
            `).join('')}
            <button type="button" class="cw-key-back" id="cw-btn-backspace" style="flex:1.4; height:42px; border:none; border-radius:6px; background:#cbd5e1; font-weight:800; font-size:1.1rem; cursor:pointer;">⌫</button>
          </div>
        </div>

      </div>
    `;

    const cellElements = container.querySelectorAll('.cw-cell');
    const bannerEl = container.querySelector('#cw-active-clue-banner');
    const clueBadgeEl = container.querySelector('#cw-clue-badge');
    const clueTextEl = container.querySelector('#cw-clue-text');
    const switchDirBtn = container.querySelector('#cw-btn-switch-dir');

    function updateHighlighting() {
      cellElements.forEach(cell => {
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);
        const isCurrent = (r === activeRow && c === activeCol);
        const isInWord = (activeDirection === 'across' && r === activeRow) ||
                         (activeDirection === 'down' && c === activeCol);

        if (isCurrent) {
          cell.style.background = '#fef08a'; // bright yellow active cell
          cell.style.boxShadow = '0 0 0 3px #f59e0b inset';
          cell.style.transform = 'scale(1.05)';
        } else if (isInWord) {
          cell.style.background = '#e0f2fe'; // soft blue word highlight
          cell.style.boxShadow = 'none';
          cell.style.transform = 'none';
        } else {
          cell.style.background = '#ffffff';
          cell.style.boxShadow = 'none';
          cell.style.transform = 'none';
        }
      });

      // Update Clue banner text
      let currentClue;
      if (activeDirection === 'across') {
        currentClue = across[activeRow];
        if (clueBadgeEl) clueBadgeEl.textContent = `${activeRow + 1}-ACROSS`;
        if (switchDirBtn) switchDirBtn.textContent = 'ACROSS';
      } else {
        currentClue = down[activeCol];
        if (clueBadgeEl) clueBadgeEl.textContent = `${activeCol + 1}-DOWN`;
        if (switchDirBtn) switchDirBtn.textContent = 'DOWN';
      }
      if (clueTextEl && currentClue) {
        clueTextEl.textContent = currentClue.clue;
      }

      // Highlight active clue in list
      container.querySelectorAll('.cw-clue-item').forEach(item => {
        const dir = item.dataset.dir;
        const r = parseInt(item.dataset.row, 10);
        const c = parseInt(item.dataset.col, 10);
        const isSelected = (dir === activeDirection) && 
                           ((dir === 'across' && r === activeRow) || (dir === 'down' && c === activeCol));
        item.style.background = isSelected ? '#dbeafe' : 'transparent';
        item.style.fontWeight = isSelected ? '800' : '500';
      });
    }

    function insertLetter(letter) {
      if (isFinished) return;
      userGrid[activeRow][activeCol] = letter.toUpperCase();
      const span = container.querySelector(`#cw-cell-${activeRow}-${activeCol}`);
      if (span) span.textContent = letter.toUpperCase();

      // Check for puzzle completion
      checkPuzzleComplete();

      // Move forward in current direction
      if (activeDirection === 'across') {
        if (activeCol < 4) {
          activeCol++;
        } else if (activeRow < 4) {
          activeRow++;
          activeCol = 0;
        }
      } else {
        if (activeRow < 4) {
          activeRow++;
        } else if (activeCol < 4) {
          activeCol++;
          activeRow = 0;
        }
      }
      updateHighlighting();
    }

    function handleBackspace() {
      if (isFinished) return;
      if (userGrid[activeRow][activeCol]) {
        userGrid[activeRow][activeCol] = '';
        const span = container.querySelector(`#cw-cell-${activeRow}-${activeCol}`);
        if (span) span.textContent = '';
      } else {
        // Move backward
        if (activeDirection === 'across') {
          if (activeCol > 0) activeCol--;
        } else {
          if (activeRow > 0) activeRow--;
        }
        userGrid[activeRow][activeCol] = '';
        const span = container.querySelector(`#cw-cell-${activeRow}-${activeCol}`);
        if (span) span.textContent = '';
      }
      updateHighlighting();
    }

    function toggleDirection() {
      activeDirection = activeDirection === 'across' ? 'down' : 'across';
      updateHighlighting();
    }

    function checkPuzzleComplete() {
      let isFull = true;
      let isAllCorrect = true;

      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          if (!userGrid[r][c]) {
            isFull = false;
          } else if (userGrid[r][c] !== grid[r][c]) {
            isAllCorrect = false;
          }
        }
      }

      if (isFull) {
        if (isAllCorrect) {
          isFinished = true;
          cellElements.forEach(cell => {
            cell.style.background = '#dcfce7'; // green
            cell.style.color = '#15803d';
          });
          const baseScore = puzzle.tier === 'easy' ? 400 : puzzle.tier === 'medium' ? 650 : 900;
          callbacks.showStatus('🎉 Spectacular! Crossword puzzle solved perfectly!', 'var(--correct-bg)');
          setTimeout(() => {
            callbacks.onWin(baseScore);
          }, 800);
        } else {
          callbacks.showStatus('⚠️ Some letters are incorrect. Review the clues!', '#ef4444');
        }
      }
    }

    // Grid Cell Click Listeners
    cellElements.forEach(cell => {
      cell.addEventListener('click', () => {
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);
        if (r === activeRow && c === activeCol) {
          toggleDirection();
        } else {
          activeRow = r;
          activeCol = c;
          updateHighlighting();
        }
      });
    });

    // Banner Click Listener
    bannerEl?.addEventListener('click', toggleDirection);
    switchDirBtn?.addEventListener('click', toggleDirection);

    // Clue Item Click Listeners
    container.querySelectorAll('.cw-clue-item').forEach(item => {
      item.addEventListener('click', () => {
        activeDirection = item.dataset.dir;
        activeRow = parseInt(item.dataset.row, 10);
        activeCol = parseInt(item.dataset.col, 10);
        updateHighlighting();
      });
    });

    // Keypad Click Listeners
    container.querySelectorAll('.cw-key').forEach(btn => {
      btn.addEventListener('click', () => {
        insertLetter(btn.dataset.key);
      });
    });

    container.querySelector('#cw-btn-backspace')?.addEventListener('click', handleBackspace);

    // Physical Keyboard Listener
    const handleKeyDown = (e) => {
      if (isFinished) return;
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        activeCol = Math.min(4, activeCol + 1);
        updateHighlighting();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        activeCol = Math.max(0, activeCol - 1);
        updateHighlighting();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeRow = Math.min(4, activeRow + 1);
        updateHighlighting();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeRow = Math.max(0, activeRow - 1);
        updateHighlighting();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleDirection();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        insertLetter(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    updateHighlighting();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  },
};
export default gameConfig;
