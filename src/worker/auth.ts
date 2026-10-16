import { Env, AuthenticatedUser, UserRow } from './types';
import { errorResponse } from './utils/response';

/**
 * Web Crypto HMAC-SHA256 JWT implementation
 * Zero external dependencies for ultra-fast Worker cold starts.
 */

function base64UrlEncode(str: string | Uint8Array): string {
  const binary = typeof str === 'string' 
    ? new TextEncoder().encode(str) 
    : str;
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
 * Signs a compact session JWT
 */
export async function signSessionJwt(payload: Record<string, unknown>, secret: string, expiresInSec = 86400 * 7): Promise<string> {
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
 * Verifies and decodes a session JWT
 */
export async function verifySessionJwt(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;
  const key = await getHmacKey(secret);

  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = base64UrlDecode(signatureB64);

  const isValid = await crypto.subtle.verify('HMAC', key, signature as unknown as BufferSource, data as unknown as BufferSource);
  if (!isValid) return null;

  try {
    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64) as unknown as BufferSource);
    const claims = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now) {
      return null; // Expired
    }
    return claims;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the user session from the request Authorization header or Cookie
 */
export async function authenticateRequest(
  request: Request,
  env: Env
): Promise<{ user: AuthenticatedUser } | { error: Response }> {
  let token: string | null = null;

  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 2. Fallback to HttpOnly cookie: gamify_session
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
    return { error: errorResponse('Missing or invalid session credentials', 401) };
  }

  const claims = await verifySessionJwt(token, env.JWT_SECRET || 'gamify_default_dev_secret_change_me');
  if (!claims || !claims.sub || !claims.uid) {
    return { error: errorResponse('Session token is invalid or expired', 401) };
  }

  return {
    user: {
      id: claims.uid as string,
      googleUid: claims.sub as string,
      email: (claims.email as string) || '',
      displayName: (claims.name as string) || 'Player',
    },
  };
}

/**
 * Verifies a Google OAuth ID Token and upserts the user in Cloudflare D1
 */
export async function handleGoogleAuth(idToken: string, env: Env): Promise<{ token: string; user: UserRow }> {
  // Query Google Token Info endpoint (or public certs)
  const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!googleRes.ok) {
    throw new Error('Failed to verify Google ID token with Google identity servers');
  }

  const payload: any = await googleRes.json();
  if (env.GOOGLE_CLIENT_ID && payload.aud !== env.GOOGLE_CLIENT_ID) {
    throw new Error('Google ID token audience mismatch');
  }

  const googleUid = payload.sub;
  const email = payload.email;
  const displayName = payload.name || email.split('@')[0];
  const avatarUrl = payload.picture || null;

  // Upsert user in Cloudflare D1
  const existingUser = await env.DB.prepare(
    'SELECT * FROM users WHERE google_uid = ?'
  ).bind(googleUid).first<UserRow>();

  let userId: string;
  let user: UserRow;

  if (!existingUser) {
    userId = `usr_${crypto.randomUUID().replace(/-/g, '')}`;
    await env.DB.prepare(`
      INSERT INTO users (id, google_uid, email, display_name, avatar_url, coins, streak_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 100, 0, DATETIME('now'), DATETIME('now'))
    `).bind(userId, googleUid, email, displayName, avatarUrl).run();

    // Default unlocks rows for wordle and number-grid
    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO user_game_unlocks (id, user_id, game_id, easy_unlocked, medium_unlocked, hard_unlocked, playground_unlocked)
        VALUES (?, ?, 'wordle', 1, 0, 0, 0)
      `).bind(`${userId}#wordle`, userId),
      env.DB.prepare(`
        INSERT INTO user_game_unlocks (id, user_id, game_id, easy_unlocked, medium_unlocked, hard_unlocked, playground_unlocked)
        VALUES (?, ?, 'number-grid', 1, 0, 0, 0)
      `).bind(`${userId}#number-grid`, userId),
    ]);

    user = (await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<UserRow>())!;
  } else {
    userId = existingUser.id;
    user = existingUser;
  }

  // Issue session JWT
  const sessionToken = await signSessionJwt(
    {
      uid: user.id,
      sub: user.google_uid,
      email: user.email,
      name: user.display_name,
    },
    env.JWT_SECRET || 'gamify_default_dev_secret_change_me'
  );

  return { token: sessionToken, user };
}
