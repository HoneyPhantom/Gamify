# Gamify — Minimalist Daily Puzzle Gaming Platform

A production-ready, static-first daily gaming platform powered by **Cloudflare Pages**, **Cloudflare Workers**, **Cloudflare D1 (SQLite)**, and **Google OAuth**.

---

## 🏛️ Architecture Overview

```
                                      +-----------------------------+
                                      |      Cloudflare Pages       |
                                      |   (Static Frontend Edge)    |
                                      | - Instant CDN delivery      |
                                      | - Vite modular game bundle  |
                                      +--------------+--------------+
                                                     |
                                            (Client-Side Execution)
                                                     |
                                   +-----------------v-----------------+
                                   |       In-Browser Game Engine      |
                                   | - Deterministic PRNG by dateStr   |
                                   | - Zero-latency puzzle generation  |
                                   | - Local client solution checks    |
                                   +-----------------+-----------------+
                                                     |
                                    (Stateful API Calls: JWT / Bearer)
                                                     |
                                      +--------------v--------------+
                                      |      Cloudflare Workers     |
                                      | - /api/auth/google          |
                                      | - /api/unlock               |
                                      | - /api/submit-score         |
                                      | - /api/leaderboard/:gameId  |
                                      +--------------+--------------+
                                                     |
                                            (D1 SQL Transactions)
                                                     |
                                      +--------------v--------------+
                                      |     Cloudflare D1 (SQLite)  |
                                      | - users                     |
                                      | - user_game_unlocks         |
                                      | - user_game_stats (O(1) avg)|
                                      | - daily_leaderboard         |
                                      | - daily_completions         |
                                      +-----------------------------+
```

---

## 🚀 Quick Start & Deployment

### 1. Database Provisioning (Cloudflare D1)

```bash
# 1. Create remote D1 database
npx wrangler d1 create gamify-prod-db

# 2. Update wrangler.toml with the generated database_id

# 3. Apply SQL migration schema locally and remotely
npm run d1:migrate:local
npm run d1:migrate:remote
```

### 2. Configure Worker Environment & Secrets

```bash
# Add Google OAuth client secret and JWT signature key
npx wrangler secret put JWT_SECRET
npx wrangler secret put GOOGLE_CLIENT_ID
```

### 3. Deploy Worker API & Pages Frontend

```bash
# Deploy Cloudflare Worker API
npm run deploy:worker

# Build and deploy frontend to Cloudflare Pages
npm run build:frontend
npx wrangler pages deploy dist --project-name=gamify
```
