/**
 * Gamify API Client
 * Manages session tokens, user unlocks, score submissions, and leaderboard fetches.
 */

const API_BASE = '/api';
const TOKEN_KEY = 'gamify_jwt_token';

class GamifyApiClient {
  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY) || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
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
      const error = new Error(data.error || 'API Request failed');
      error.status = response.status;
      error.details = data.details;
      throw error;
    }
    return data;
  }

  async loginWithGoogle(idToken) {
    const data = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    this.setToken(data.token);
    return data.user;
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
    const query = difficulty ? `?difficulty=${difficulty}` : '';
    return this.request(`/leaderboard/${gameId}${query}`);
  }
}

export const api = new GamifyApiClient();
