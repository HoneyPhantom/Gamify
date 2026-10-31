/**
 * Gamify API Client - High-Efficiency Offline-First & Minimal-Worker-Calls Architecture
 * 
 * Manages 4-digit PIN authentication, permanent session persistence, game unlocks,
 * score submissions, leaderboard syncing, and friends/profile management with
 * multi-tier client caching to reduce worker calls to the bare minimum.
 */

const API_BASE = '/api';
const TOKEN_KEY = 'gamify_jwt_token';
const USER_KEY = 'gamify_user_profile';

class GamifyApiClient {
  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY) || null;
    this.onSessionExpired = null;

    // In-memory caches to eliminate unnecessary Cloudflare worker calls
    this._leaderboardCache = new Map();
    this._profileCache = new Map();
    this._searchCache = new Map();
    this._shopCache = null;
    this._lastMeCache = null;
    this._lastMeTime = 0;
  }

  setSession(token, user) {
    this.token = token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      this.clearAllCaches();
    }
  }

  getCachedUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  clearAllCaches() {
    this._leaderboardCache.clear();
    this._profileCache.clear();
    this._searchCache.clear();
    this._shopCache = null;
    this._lastMeCache = null;
    this._lastMeTime = 0;
  }

  invalidateLeaderboard(gameId = null) {
    if (!gameId || gameId === 'all') {
      this._leaderboardCache.clear();
    } else {
      for (const key of this._leaderboardCache.keys()) {
        if (key.startsWith(gameId) || key.startsWith('all')) {
          this._leaderboardCache.delete(key);
        }
      }
    }
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {}),
      },
    });

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401 && (data.details?.code === 'SESSION_EXPIRED' || data.code === 'SESSION_EXPIRED')) {
        const user = this.getCachedUser();
        this.setSession(null, null);
        if (this.onSessionExpired) {
          this.onSessionExpired(user?.username);
        }
      }
      const error = new Error(data.error || 'API Request failed');
      error.status = response.status;
      error.details = data.details;
      error.code = data.details?.code || data.code;
      throw error;
    }
    return data;
  }

  async register(username, displayName, pin) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, displayName, pin }),
    });
    this.setSession(data.token, data.user);
    return data;
  }

  async login(username, pin) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, pin }),
    });
    this.setSession(data.token, data.user);
    return data;
  }

  logout() {
    this.setSession(null, null);
  }

  /**
   * Single batched /api/me request with 15s throttle to prevent redundant calls.
   */
  async getMe(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && this._lastMeCache && (now - this._lastMeTime < 15000)) {
      return this._lastMeCache;
    }
    const data = await this.request('/me');
    this._lastMeCache = data;
    this._lastMeTime = now;
    return data;
  }

  async unlockTier(gameId, tier) {
    const res = await this.request('/unlock', {
      method: 'POST',
      body: JSON.stringify({ gameId, tier }),
    });
    this._lastMeCache = null; // Invalidate profile cache
    return res;
  }

  async submitScore(payload) {
    const data = await this.request('/submit-score', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    // Invalidate cached leaderboards for this game so freshly earned scores show up
    this.invalidateLeaderboard(payload.gameId);
    this._lastMeCache = null;
    return data;
  }

  /**
   * Cached Leaderboard Request:
   * Serves from memory if queried within 3 minutes, eliminating repeated worker hits.
   */
  async getLeaderboard(gameId = 'all', difficulty = null, week = null, forceRefresh = false) {
    const cacheKey = `${gameId || 'all'}_${difficulty || 'any'}_${week || 'current'}`;
    const now = Date.now();
    const cached = this._leaderboardCache.get(cacheKey);

    if (!forceRefresh && cached && (now - cached.timestamp < 180000)) {
      return cached.data;
    }

    const params = new URLSearchParams();
    if (difficulty) params.set('difficulty', difficulty);
    if (week) params.set('week', week);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const data = await this.request(`/leaderboard/${gameId || 'all'}${queryStr}`);
    this._leaderboardCache.set(cacheKey, { data, timestamp: now });
    return data;
  }

  // Friends & Profile Management
  async getFriends() {
    return this.request('/friends');
  }

  async addFriend(username) {
    const res = await this.request('/friends/add', {
      method: 'POST',
      body: JSON.stringify({ friendUsername: username, username }),
    });
    this._lastMeCache = null;
    return res;
  }

  async removeFriend(friendId, username = null) {
    const res = await this.request('/friends/remove', {
      method: 'POST',
      body: JSON.stringify({ friendId, username }),
    });
    this._lastMeCache = null;
    return res;
  }

  async searchUsers(query) {
    const q = query.trim().toLowerCase();
    const now = Date.now();
    const cached = this._searchCache.get(q);
    if (cached && (now - cached.timestamp < 60000)) {
      return cached.data;
    }
    const data = await this.request(`/users/search?q=${encodeURIComponent(query)}`);
    this._searchCache.set(q, { data, timestamp: now });
    return data;
  }

  async getUserProfile(username, forceRefresh = false) {
    const u = username.trim().toLowerCase();
    const now = Date.now();
    const cached = this._profileCache.get(u);
    if (!forceRefresh && cached && (now - cached.timestamp < 120000)) {
      return cached.data;
    }
    const data = await this.request(`/users/${encodeURIComponent(username)}`);
    this._profileCache.set(u, { data, timestamp: now });
    return data;
  }

  async updateProfile(displayName, about) {
    const res = await this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ displayName, about }),
    });
    this._lastMeCache = null;
    return res;
  }

  async useHint(gameId = 'number-grid') {
    return this.request('/games/hint', {
      method: 'POST',
      body: JSON.stringify({ gameId }),
    });
  }

  // Cosmetic Shop with 30-minute caching
  async getShop(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && this._shopCache && (now - this._shopCache.timestamp < 1800000)) {
      return this._shopCache.data;
    }
    const data = await this.request('/shop');
    this._shopCache = { data, timestamp: now };
    return data;
  }

  async buyCosmetic(itemId) {
    const res = await this.request('/shop/buy', {
      method: 'POST',
      body: JSON.stringify({ itemId }),
    });
    this._shopCache = null;
    this._lastMeCache = null;
    return res;
  }

  async equipCosmetic(payload) {
    const res = await this.request('/shop/equip', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this._shopCache = null;
    this._lastMeCache = null;
    return res;
  }

  // PvP Challenges
  async createChallenge(payload) {
    return this.request('/challenges/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getChallenges() {
    return this.request('/challenges');
  }

  async respondChallenge(payload) {
    return this.request('/challenges/respond', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Friends Activity Feed
  async getActivityFeed() {
    return this.request('/friends/feed');
  }
}

export const api = new GamifyApiClient();
