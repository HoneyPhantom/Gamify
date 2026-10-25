/**
 * Gamify API Client
 * Manages 4-digit PIN authentication, permanent session persistence, game unlocks,
 * score submissions, leaderboard syncing, and friends/profile management.
 */

const API_BASE = '/api';
const TOKEN_KEY = 'gamify_jwt_token';
const USER_KEY = 'gamify_user_profile';

class GamifyApiClient {
  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY) || null;
    this.onSessionExpired = null;
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

  // Friends & Profile Management
  async getFriends() {
    return this.request('/friends');
  }

  async addFriend(username) {
    return this.request('/friends/add', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  }

  async removeFriend(friendId) {
    return this.request('/friends/remove', {
      method: 'POST',
      body: JSON.stringify({ friendId }),
    });
  }

  async searchUsers(query) {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`);
  }

  async getUserProfile(username) {
    return this.request(`/users/${encodeURIComponent(username)}`);
  }

  async updateProfile(displayName, about) {
    return this.request('/user/profile', {
      method: 'POST',
      body: JSON.stringify({ displayName, about }),
    });
  }
}

export const api = new GamifyApiClient();
