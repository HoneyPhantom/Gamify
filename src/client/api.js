/**
 * Gamify API Client
 * Manages 4-digit PIN authentication, 7-day session lifetimes, game unlocks,
 * score submissions, and leaderboard syncing.
 */

const API_BASE = '/api';
const TOKEN_KEY = 'gamify_jwt_token';
const USER_KEY = 'gamify_user_profile';
const TOKEN_SAVED_AT_KEY = 'gamify_token_saved_at';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

class GamifyApiClient {
  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY) || null;
    this.onSessionExpired = null;
  }

  setSession(token, user) {
    this.token = token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_SAVED_AT_KEY, Date.now().toString());
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_SAVED_AT_KEY);
      localStorage.removeItem(USER_KEY);
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

  isSessionExpired() {
    if (!this.token) return true;
    const savedAt = localStorage.getItem(TOKEN_SAVED_AT_KEY);
    if (!savedAt) return true;
    const elapsed = Date.now() - parseInt(savedAt, 10);
    return elapsed >= SEVEN_DAYS_MS;
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token && !this.isSessionExpired()) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    // Client-side 7-day expiry check
    if (this.token && this.isSessionExpired() && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
      const user = this.getCachedUser();
      this.setSession(null, null);
      if (this.onSessionExpired) {
        this.onSessionExpired(user?.username);
      }
      const err = new Error('Your 7-day session has expired. Please enter your 4-digit PIN.');
      err.status = 401;
      err.code = 'SESSION_EXPIRED';
      throw err;
    }

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

  async getMe() {
    return this.request('/me');
  }

  async unlockTier(gameId, tier) {
    return this.request('/unlock', {
      method: 'POST',
      body: JSON.stringify({ gameId, tier }),
    });
  }

  async submitScore(payload) {
    return this.request('/submit-score', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getLeaderboard(gameId, difficulty = null) {
    const params = new URLSearchParams();
    if (difficulty) params.set('difficulty', difficulty);
    params.set('_t', Date.now().toString());
    return this.request(`/leaderboard/${gameId}?${params.toString()}`);
  }
}

export const api = new GamifyApiClient();
