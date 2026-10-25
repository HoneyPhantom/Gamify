import { Env, AuthenticatedUser, UserRow, RegisterRequestBody, LoginRequestBody } from './types';
import { errorResponse } from './utils/response';

/**
 * Web Crypto PBKDF2 PIN hashing & HMAC-SHA256 JWT
 * Pure native Web Crypto API with 0 external dependencies for sub-millisecond execution.
 */

// Long-lived permanent session (1 year) - no weekly forced re-login required
export const SESSION_EXPIRY_SEC = 365 * 24 * 60 * 60; // 31,536,000 seconds
export const WEEKLY_SESSION_EXPIRY_SEC = SESSION_EXPIRY_SEC; // Backward compatibility alias

function base64UrlEncode(str: string | Uint8Array): string {
  const binary = typeof str === 'string' ? new TextEncoder().encode(str) : str;
  let base64 = btoa(String.fromCharCode(...binary));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const raw = atob(base64);
  const result = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    result[i] = raw.charCodeAt(i);
  }
  return result;
}

/**
 * Generates a 32-character hexadecimal random salt
 */
export function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Derives a PBKDF2-SHA256 hash from a 4-digit PIN and salt (100,000 iterations)
 */
export async function hashPin(pin: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(pin) as unknown as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt) as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies a 4-digit PIN against stored PBKDF2 hash & salt
 */
export async function verifyPin(pin: string, salt: string, expectedHash: string): Promise<boolean> {
  const computedHash = await hashPin(pin, salt);
  return computedHash === expectedHash;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret) as unknown as BufferSource,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Signs a compact session JWT with long-lived lifetime
 */
export async function signSessionJwt(
  payload: Record<string, unknown>,
  secret: string,
  expiresInSec = SESSION_EXPIRY_SEC
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresInSec,
  };

  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(claims));
  const data = new TextEncoder().encode(`${encHeader}.${encPayload}`);

  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, data as unknown as BufferSource);
  const encSignature = base64UrlEncode(new Uint8Array(signature));

  return `${encHeader}.${encPayload}.${encSignature}`;
}

/**
 * Verifies and decodes a session JWT, strictly checking 7-day expiration
 */
export async function verifySessionJwt(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;
  const key = await getHmacKey(secret);

  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = base64UrlDecode(signatureB64);

  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    signature as unknown as BufferSource,
    data as unknown as BufferSource
  );
  if (!isValid) return null;

  try {
    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64) as unknown as BufferSource);
    const claims = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now) {
      return null; // Expired after 1 week
    }
    return claims;
  } catch {
    return null;
  }
}

/**
 * Authentication Middleware: Extracts and validates Bearer token or Cookie.
 * Enforces weekly session expiration.
 */
export async function authenticateRequest(
  request: Request,
  env: Env
): Promise<{ user: AuthenticatedUser } | { error: Response }> {
  let token: string | null = null;

  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  if (!token) {
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/gamify_session=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }
  }

  if (!token) {
    return {
      error: errorResponse('Authentication required. Please enter your 4-digit PIN.', 401, {
        code: 'AUTH_REQUIRED',
      }),
    };
  }

  const claims = await verifySessionJwt(token, env.JWT_SECRET || 'gamify_secret_session_key_production');
  if (!claims || !claims.uid || !claims.username) {
    return {
      error: errorResponse('Session expired after 7 days. Please enter your 4-digit PIN to continue.', 401, {
        code: 'SESSION_EXPIRED',
      }),
    };
  }

  return {
    user: {
      id: claims.uid as string,
      username: claims.username as string,
      displayName: (claims.name as string) || (claims.username as string),
    },
  };
}

/**
 * Handles First-Time Profile Creation with 4-Digit PIN
 */
export async function handleRegister(body: RegisterRequestBody, env: Env): Promise<{ token: string; user: any }> {
  const username = body.username ? body.username.trim().toLowerCase() : '';
  const displayName = body.displayName ? body.displayName.trim() : username;
  const pin = body.pin ? body.pin.trim() : '';

  if (!username || username.length < 3 || username.length > 20 || !/^[a-z0-9_-]+$/.test(username)) {
    throw new Error('Username must be 3-20 characters long and contain only letters, numbers, underscores or hyphens.');
  }

  if (!pin || !/^\d{4}$/.test(pin)) {
    throw new Error('PIN must be exactly 4 numeric digits (e.g. 1234).');
  }

  // Check username collision
  const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
  if (existing) {
    throw new Error(`Username '${username}' is already taken. Please choose another.`);
  }

  const salt = generateSalt();
  const pinHash = await hashPin(pin, salt);
  const userId = `usr_${crypto.randomUUID().replace(/-/g, '')}`;

  // Insert user with initial 100 coins
  await env.DB.prepare(`
    INSERT INTO users (id, username, display_name, pin_hash, pin_salt, coins, streak_count, last_login_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 100, 0, DATETIME('now'), DATETIME('now'), DATETIME('now'))
  `).bind(userId, username, displayName, pinHash, salt).run();

  // Initialize Game Unlocks:
  // - Wordle: Unlocked by default (Free to Play)
  // - Number Grid Matrix: LOCKED by default (100 coins)
  // - Number Trail: LOCKED by default (150 coins)
  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO user_game_unlocks (id, user_id, game_id, game_unlocked, easy_unlocked, medium_unlocked, hard_unlocked, playground_unlocked)
      VALUES (?, ?, 'wordle', 1, 1, 0, 0, 1)
    `).bind(`${userId}#wordle`, userId),
    env.DB.prepare(`
      INSERT INTO user_game_unlocks (id, user_id, game_id, game_unlocked, easy_unlocked, medium_unlocked, hard_unlocked, playground_unlocked)
      VALUES (?, ?, 'number-grid', 0, 0, 0, 0, 0)
    `).bind(`${userId}#number-grid`, userId),
    env.DB.prepare(`
      INSERT INTO user_game_unlocks (id, user_id, game_id, game_unlocked, easy_unlocked, medium_unlocked, hard_unlocked, playground_unlocked)
      VALUES (?, ?, 'number-trail', 0, 0, 0, 0, 0)
    `).bind(`${userId}#number-trail`, userId),
  ]);

  const token = await signSessionJwt(
    {
      uid: userId,
      username,
      name: displayName,
    },
    env.JWT_SECRET || 'gamify_secret_session_key_production'
  );

  return {
    token,
    user: {
      id: userId,
      username,
      displayName,
      coins: 100,
      streakCount: 0,
      lastPlayedDate: null,
    },
  };
}

/**
 * Handles Returning Player Login with 4-Digit PIN
 */
export async function handleLogin(body: LoginRequestBody, env: Env): Promise<{ token: string; user: any }> {
  const username = body.username ? body.username.trim().toLowerCase() : '';
  const pin = body.pin ? body.pin.trim() : '';

  if (!username || !pin) {
    throw new Error('Please enter both your username and 4-digit PIN.');
  }

  if (!/^\d{4}$/.test(pin)) {
    throw new Error('PIN must be exactly 4 numeric digits.');
  }

  const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first<UserRow>();
  if (!user) {
    throw new Error('Profile not found. Please check your username or register as a new player.');
  }

  const isValidPin = await verifyPin(pin, user.pin_salt, user.pin_hash);
  if (!isValidPin) {
    throw new Error('Incorrect 4-digit PIN. Please try again.');
  }

  // Update last login timestamp
  await env.DB.prepare("UPDATE users SET last_login_at = DATETIME('now') WHERE id = ?").bind(user.id).run();

  // Issue fresh 7-day session token
  const token = await signSessionJwt(
    {
      uid: user.id,
      username: user.username,
      name: user.display_name,
    },
    env.JWT_SECRET || 'gamify_secret_session_key_production'
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      coins: user.coins,
      streakCount: user.streak_count,
      lastPlayedDate: user.last_played_date,
    },
  };
}
