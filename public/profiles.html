<?php
// Gamify Dynamic Player Profile Template
// URL Formats: /profile.php?id=5 | /profiles?id=5 | /profile.php?username=archcrispy
$userId = isset($_GET['id']) ? htmlspecialchars($_GET['id']) : (isset($_GET['username']) ? htmlspecialchars($_GET['username']) : '');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Player Profile — Gamify</title>
  <meta name="description" content="View player statistics, level, streaks, and achievements on Gamify - the daily logic puzzle universe." />
  <link rel="icon" href="/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg-color: #f8fafc;
      --card-bg: #ffffff;
      --text-color: #0f172a;
      --text-muted: #64748b;
      --border-color: #e2e8f0;
      --accent: #2563eb;
      --accent-hover: #1d4ed8;
      --correct-bg: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
      --shadow-md: 0 10px 25px -5px rgba(0,0,0,0.08);
      --radius-lg: 20px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background: var(--bg-color);
      color: var(--text-color);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header.site-header {
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      padding: 0.75rem 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 1.4rem;
      font-weight: 900;
      color: #0f172a;
    }
    .brand-logo span.logo-badge {
      background: linear-gradient(135deg, #ef4444, #f59e0b, #10b981, #2563eb, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .coin-pill {
      background: #fef3c7;
      border: 1px solid #fde68a;
      color: #92400e;
      font-weight: 800;
      font-size: 0.85rem;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .btn-nav-home {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
      padding: 0.4rem 0.85rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.15s;
    }
    .btn-nav-home:hover { background: #e2e8f0; }

    /* Page Layout with Desktop Side Ads (Requirement 6) */
    .page-layout-wrapper {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 2rem;
      padding: 2rem 1rem;
      max-width: 1260px;
      margin: 0 auto;
      width: 100%;
    }
    .side-ad-rail {
      width: 160px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: sticky;
      top: 80px;
    }
    .ad-slot-box {
      width: 160px;
      min-height: 600px;
      border: 1px dashed #cbd5e1;
      background: rgba(241, 245, 249, 0.5);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      font-size: 0.75rem;
      text-align: center;
      padding: 0.5rem;
    }
    .ad-banner-label {
      font-size: 0.68rem;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      display: block;
      text-align: center;
    }
    .main-profile-column {
      flex: 1;
      max-width: 620px;
      min-width: 0;
    }

    /* Mobile Top Ad Banner */
    .mobile-ad-banner {
      display: none;
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .mobile-ad-box {
      width: 100%;
      min-height: 90px;
      border: 1px dashed #cbd5e1;
      background: rgba(241, 245, 249, 0.5);
      border-radius: 12px;
    }

    @media (max-width: 959px) {
      .side-ad-rail { display: none; }
      .mobile-ad-banner { display: block; }
    }

    /* Profile Card (Image 1 & Image 2 Style) */
    .profile-card {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 2rem 1.75rem;
      box-shadow: var(--shadow-md);
      position: relative;
    }
    .profile-avatar-large {
      width: 76px;
      height: 76px;
      border-radius: 50%;
      background: #e0f2fe;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.2rem;
      border: 3px solid #38bdf8;
      margin: 0 auto 0.75rem auto;
      box-shadow: 0 4px 14px rgba(56, 189, 248, 0.25);
    }
    .profile-title-header {
      text-align: center;
      margin-bottom: 0.75rem;
    }
    .profile-gamertag {
      font-size: 1.5rem;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.2;
    }
    .profile-handle {
      font-size: 0.88rem;
      color: var(--text-muted);
      font-weight: 600;
      margin-top: 2px;
    }
    .profile-level-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #fef3c7;
      border: 1px solid #fde68a;
      color: #92400e;
      font-weight: 800;
      font-size: 0.85rem;
      padding: 0.35rem 0.8rem;
      border-radius: 999px;
      margin-top: 0.5rem;
    }

    /* Clickable Followers & Following Counts (Image 2 style) */
    .social-counts-row {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin: 1rem 0;
      font-size: 0.95rem;
      font-weight: 700;
    }
    .social-count-item {
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      transition: background 0.15s;
    }
    .social-count-item:hover {
      background: #f1f5f9;
      color: var(--text-color);
    }
    .social-count-item strong {
      color: var(--accent);
      margin-left: 4px;
    }

    /* Social List Drawer (when clicking followers/following) */
    .social-drawer {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1.25rem;
      display: none;
    }
    .social-drawer.active { display: block; }
    .social-drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      font-weight: 800;
      font-size: 0.9rem;
    }
    .social-drawer-items {
      max-height: 220px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .social-user-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      transition: transform 0.15s, border-color 0.15s;
    }
    .social-user-row:hover {
      transform: translateY(-1px);
      border-color: var(--accent);
    }

    /* About Section */
    .about-box {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1rem 1.25rem;
      margin: 1.25rem 0;
      font-size: 0.95rem;
      color: #334155;
      text-align: center;
    }

    /* Streaks Maintained Grid */
    .streaks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 0.65rem;
      margin-top: 0.75rem;
    }
    .streak-card {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 0.75rem 0.5rem;
      text-align: center;
    }
    .streak-game-title {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .streak-score-val {
      font-size: 1.25rem;
      font-weight: 900;
      color: #ea580c;
      margin-top: 2px;
    }

    /* Action Buttons */
    .profile-actions-row {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
      flex-wrap: wrap;
    }
    .btn-action-primary {
      flex: 1;
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-weight: 800;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35);
      transition: transform 0.15s;
    }
    .btn-action-primary:hover { transform: translateY(-2px); }

    .btn-action-secondary {
      flex: 1;
      padding: 0.75rem 1rem;
      background: #ffffff;
      color: #334155;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      font-weight: 800;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background 0.15s;
      text-align: center;
    }
    .btn-action-secondary:hover { background: #f8fafc; }

    /* Privacy Toggle Box */
    .privacy-toggle-box {
      margin-top: 1.25rem;
      padding: 0.75rem 1rem;
      background: #f1f5f9;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .privacy-select {
      padding: 0.35rem 0.75rem;
      font-weight: 800;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      font-family: inherit;
    }

    /* Modal Overlay (Image 1 Style) */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    .modal-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 1.75rem 1.6rem;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 20px 45px rgba(15,23,42,0.22);
    }

    /* Static Text Section for AdSense */
    .profile-static-info {
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
      color: #475569;
      font-size: 0.88rem;
      line-height: 1.6;
    }
    .profile-static-info h3 {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 0.5rem;
    }
    .profile-static-info p { margin-bottom: 0.75rem; }

    /* Footer */
    footer.site-footer {
      background: #ffffff;
      border-top: 1px solid var(--border-color);
      padding: 2rem 1.5rem;
      margin-top: auto;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }
    .footer-links a {
      color: var(--text-color);
      text-decoration: none;
      font-weight: 700;
    }
    .footer-links a:hover { color: var(--accent); }
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="site-header">
    <a href="/" class="brand-logo">
      <span>🎮</span>
      <span class="logo-badge">Gamify</span>
    </a>
    <div class="header-actions">
      <div class="coin-pill">🪙 <span id="header-user-coins">100</span> Coins</div>
      <a href="/" class="btn-nav-home">Home</a>
    </div>
  </header>

  <!-- Page Layout with Side Ads (Requirement 6) -->
  <div class="page-layout-wrapper">
    <!-- Desktop Left Side Ad Rail -->
    <aside class="side-ad-rail" aria-label="Advertisement">
      <span class="ad-banner-label">Advertisement</span>
      <div class="ad-slot-box">Responsive Vertical Banner</div>
    </aside>

    <!-- Main Profile Card Content -->
    <main class="main-profile-column">
      <!-- Mobile Top Ad Banner -->
      <div class="mobile-ad-banner">
        <span class="ad-banner-label">Advertisement</span>
        <div class="mobile-ad-box"></div>
      </div>

      <div class="profile-card" id="profile-card-content">
        <!-- Avatar & Details -->
        <div class="profile-avatar-large" id="profile-display-avatar">🎮</div>
        <div class="profile-title-header">
          <h1 class="profile-gamertag" id="profile-display-name">Player</h1>
          <p class="profile-handle" id="profile-display-handle">@loading</p>
          <div class="profile-level-badge" id="profile-display-level">⭐ Lvl 1 • Novice</div>
        </div>

        <!-- Followers & Following (Clickable if public) -->
        <div class="social-counts-row">
          <div class="social-count-item" id="btn-toggle-followers">
            Followers: <strong id="profile-followers-count">0</strong>
          </div>
          <div class="social-count-item" id="btn-toggle-following">
            Following: <strong id="profile-following-count">0</strong>
          </div>
        </div>

        <!-- Social List Drawer (Opened when clicking Followers or Following) -->
        <div class="social-drawer" id="social-drawer">
          <div class="social-drawer-header">
            <span id="social-drawer-title">Followers</span>
            <button type="button" id="btn-close-drawer" style="border:none; background:none; cursor:pointer; font-size:1rem; color:#64748b;">✕</button>
          </div>
          <div class="social-drawer-items" id="social-drawer-list">
            <!-- Populated dynamically -->
          </div>
        </div>

        <!-- About Description -->
        <div class="about-box" id="profile-about-box">
          Loading player bio...
        </div>

        <!-- Best Streaks Maintained -->
        <div style="margin-top: 1.5rem;">
          <h3 style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">
            🔥 Best Streaks Maintained:
          </h3>
          <div class="streaks-grid" id="profile-streaks-grid">
            <!-- Populated dynamically -->
          </div>
        </div>

        <!-- Actions Row (Challenge / Follow or Install / Edit if self) -->
        <div class="profile-actions-row" id="profile-actions-container">
          <!-- Populated dynamically -->
        </div>

        <!-- Privacy Setting (Only shown when viewing own profile) -->
        <div class="privacy-toggle-box hidden" id="own-privacy-box">
          <div>
            <strong style="font-size: 0.85rem; color: #0f172a;">Profile Privacy</strong>
            <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Hide followers & following from non-followers</p>
          </div>
          <select id="select-profile-privacy" class="privacy-select">
            <option value="0">🌐 Public</option>
            <option value="1">🔒 Private</option>
          </select>
        </div>
      </div>

      <!-- Static SEO & AdSense Section (250+ Words Original Text) -->
      <section class="profile-static-info">
        <h3>About Gamify Player Profiles & Progression System</h3>
        <p>
          Welcome to the official player profile hub on <strong>Gamify</strong>. Every registered puzzle enthusiast is assigned a unique gamertag, cryptographic identifier, and persistent skill ledger that tracks puzzle-solving prowess across six unique daily brain challenges: Word Guess, Number Grid, Classic Sudoku, Memory Match, Number Trail, and the Daily Crossword.
        </p>
        <p>
          <strong>Experience Points (XP) & Player Levels:</strong> Whenever you conquer a daily puzzle, your profile is credited with experience points calibrated by puzzle complexity and speed bonuses. As your XP grows, your rank advances from Novice to Apprentice, Strategist, Master, and ultimately Grandmaster. Your avatar frame visually showcases your earned prestige to fellow contenders across the global arena.
        </p>
        <p>
          <strong>Consecutive Daily Streaks:</strong> Consistency is the cornerstone of cognitive agility. Gamify tracks consecutive calendar day completions calculated precisely at UTC midnight. Solving all daily sweep games awards bonus coins and elevates your historic best streak badge. If a day is missed, active streaks reset while your historic high watermark remains permanently celebrated on your profile.
        </p>
        <p>
          <strong>Social Privacy Controls:</strong> Gamify gives players complete sovereignty over their social footprint. Accounts marked as <em>Public</em> allow community members to inspect follower networks and challenge players directly. Setting your account to <em>Private</em> conceals your follower roster from non-followers while preserving your standing on the World Wars global leaderboards.
        </p>
      </section>
    </main>

    <!-- Desktop Right Side Ad Rail -->
    <aside class="side-ad-rail" aria-label="Advertisement">
      <span class="ad-banner-label">Advertisement</span>
      <div class="ad-slot-box">Responsive Vertical Banner</div>
    </aside>
  </div>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="/about.html">About Us</a>
      <a href="/privacy.html">Privacy Policy</a>
      <a href="/contact.html">Contact Us</a>
      <a href="/terms.html">Terms of Service</a>
    </div>
    <p>&copy; <?php echo date('Y'); ?> Gamify. All rights reserved. Logic puzzles refreshed daily at 00:00 UTC.</p>
  </footer>

  <script>
    // Client-side Profile Data Hydration
    (async function initProfilePage() {
      const urlParams = new URLSearchParams(window.location.search);
      let targetIdentifier = urlParams.get('id') || urlParams.get('username') || '';

      // Fallback: check session user from localStorage if no query param provided
      const storedUser = localStorage.getItem('gamify_session_user');
      let currentUser = null;
      let token = localStorage.getItem('gamify_session_token');
      try {
        if (storedUser) currentUser = JSON.parse(storedUser);
      } catch {}

      if (!targetIdentifier && currentUser) {
        targetIdentifier = currentUser.id || currentUser.username;
      }

      if (!targetIdentifier) {
        targetIdentifier = 'guest';
      }

      const avatarEl = document.getElementById('profile-display-avatar');
      const nameEl = document.getElementById('profile-display-name');
      const handleEl = document.getElementById('profile-display-handle');
      const levelEl = document.getElementById('profile-display-level');
      const aboutEl = document.getElementById('profile-about-box');
      const followersCountEl = document.getElementById('profile-followers-count');
      const followingCountEl = document.getElementById('profile-following-count');
      const streaksGridEl = document.getElementById('profile-streaks-grid');
      const actionsContainer = document.getElementById('profile-actions-container');
      const privacyBox = document.getElementById('own-privacy-box');
      const privacySelect = document.getElementById('select-profile-privacy');
      const drawer = document.getElementById('social-drawer');
      const drawerTitle = document.getElementById('social-drawer-title');
      const drawerList = document.getElementById('social-drawer-list');

      let currentProfileData = null;

      try {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/users/${encodeURIComponent(targetIdentifier)}`, { headers });
        const data = await res.json();

        if (!data.success || !data.profile) {
          throw new Error(data.message || 'Player not found');
        }

        currentProfileData = data.profile;
        document.title = `${currentProfileData.displayName || currentProfileData.username}'s Profile — Gamify`;

        // Render details
        nameEl.textContent = currentProfileData.displayName || currentProfileData.username;
        handleEl.textContent = `@${currentProfileData.username}`;
        levelEl.textContent = `⭐ Lvl ${currentProfileData.level || 1} • ${currentProfileData.levelTitle || 'Novice'}`;
        aboutEl.textContent = currentProfileData.about || 'Puzzle solver climbing to the top!';

        // Cosmetic frame
        if (currentProfileData.selectedFrame && currentProfileData.selectedFrame !== 'default') {
          avatarEl.style.borderColor = currentProfileData.selectedFrame === 'gold' ? '#f59e0b' : '#38bdf8';
        }

        // Followers / Following Privacy Check
        if (currentProfileData.canViewFollowers) {
          followersCountEl.textContent = currentProfileData.followersCount ?? (currentProfileData.followers || []).length;
          followingCountEl.textContent = currentProfileData.followingCount ?? (currentProfileData.following || []).length;
        } else {
          followersCountEl.textContent = '🔒 Private';
          followingCountEl.textContent = '🔒 Private';
        }

        // Render Streaks
        const allGameTitles = {
          'number-grid': 'Number Grid',
          'sudoku': 'Classic Sudoku',
          'memory-match': 'Memory Match',
          'wordle': 'Word Guess',
          'number-trail': 'Number Trail',
          'crossword': 'Daily Crossword'
        };

        const streakList = currentProfileData.streaks || [];
        streaksGridEl.innerHTML = Object.entries(allGameTitles).map(([gid, title]) => {
          const match = streakList.find(s => s.game_id === gid);
          const best = match ? match.best_streak : 0;
          return `
            <div class="streak-card">
              <div class="streak-game-title">${title}</div>
              <div class="streak-score-val">🔥 ${best}</div>
            </div>
          `;
        }).join('');

        const isSelf = currentProfileData.isSelf || (currentUser && currentUser.username === currentProfileData.username);

        // Actions Rendering
        if (isSelf) {
          // Viewing own profile: Install App & Privacy Toggle
          privacyBox.classList.remove('hidden');
          privacySelect.value = currentProfileData.isPrivate ? '1' : '0';

          privacySelect.addEventListener('change', async () => {
            const isPriv = privacySelect.value === '1';
            try {
              await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isPrivate: isPriv })
              });
              alert('Profile privacy updated successfully!');
            } catch (err) {
              alert('Failed to update privacy');
            }
          });

          actionsContainer.innerHTML = `
            <button type="button" class="btn-action-primary" id="btn-trigger-install">📲 Install App</button>
            <button type="button" class="btn-action-secondary" id="btn-profile-logout">🚪 Logout</button>
          `;

          let deferredInstallPrompt = null;
          window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredInstallPrompt = e;
          });

          document.getElementById('btn-trigger-install')?.addEventListener('click', async () => {
            if (deferredInstallPrompt) {
              try {
                deferredInstallPrompt.prompt();
                await deferredInstallPrompt.userChoice;
              } catch (e) {}
              deferredInstallPrompt = null;
            }
          });

          document.getElementById('btn-profile-logout')?.addEventListener('click', () => {
            localStorage.removeItem('gamify_session_user');
            localStorage.removeItem('gamify_session_token');
            window.location.href = '/';
          });
        } else {
          // Viewing another player: Challenge & Follow/Unfollow
          const isFollowing = currentProfileData.isFollowing;
          actionsContainer.innerHTML = `
            <button type="button" class="btn-action-primary" id="btn-challenge-player">🎯 Challenge Player</button>
            <button type="button" class="btn-action-secondary" id="btn-toggle-follow">${isFollowing ? 'Unfollow' : 'Follow Player'}</button>
          `;

          document.getElementById('btn-challenge-player')?.addEventListener('click', () => {
            window.location.href = `/?challenge=${encodeURIComponent(currentProfileData.username)}`;
          });

          document.getElementById('btn-toggle-follow')?.addEventListener('click', async () => {
            if (!token) {
              alert('Please log in on Gamify to follow players.');
              return;
            }
            try {
              const endpoint = isFollowing ? '/api/friends/remove' : '/api/friends/add';
              await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: currentProfileData.username })
              });
              window.location.reload();
            } catch (err) {
              alert('Action failed');
            }
          });
        }

        // Clicking Followers / Following (Image 2 style)
        const showDrawer = (type) => {
          if (!currentProfileData.canViewFollowers) {
            alert('This player has set their account to Private. Follow them to view their connections.');
            return;
          }
          drawer.classList.add('active');
          drawerTitle.textContent = type === 'followers' ? 'Followers' : 'Following';
          const list = type === 'followers' ? (currentProfileData.followers || []) : (currentProfileData.following || []);
          if (list.length === 0) {
            drawerList.innerHTML = `<div style="text-align:center; color:#94a3b8; padding:1rem; font-size:0.85rem;">No ${type} yet.</div>`;
          } else {
            drawerList.innerHTML = list.map(u => `
              <a href="/profile.php?username=${encodeURIComponent(u.username)}" class="social-user-row">
                <span style="font-weight:800;">${u.display_name || u.username}</span>
                <span style="color:#64748b; font-size:0.82rem;">@${u.username}</span>
              </a>
            `).join('');
          }
        };

        document.getElementById('btn-toggle-followers')?.addEventListener('click', () => showDrawer('followers'));
        document.getElementById('btn-toggle-following')?.addEventListener('click', () => showDrawer('following'));
        document.getElementById('btn-close-drawer')?.addEventListener('click', () => drawer.classList.remove('active'));

      } catch (err) {
        aboutEl.innerHTML = `<p style="color:var(--danger); font-weight:700;">${err.message || 'Could not load player profile'}</p>`;
      }
    })();
  </script>
</body>
</html>
