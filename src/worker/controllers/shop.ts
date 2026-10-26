import { Env, AuthenticatedUser } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';

export interface CosmeticItem {
  id: string;
  name: string;
  type: 'frame' | 'title';
  cost: number;
  description: string;
  preview: string; // color code or display text
}

export const COSMETIC_CATALOG: CosmeticItem[] = [
  // Avatar Frames
  { id: 'frame_cyan', name: 'Neon Cyan Glow', type: 'frame', cost: 150, description: 'Electric cyan glowing aura around your avatar', preview: '#06b6d4' },
  { id: 'frame_gold', name: 'Golden Legend', type: 'frame', cost: 300, description: 'Shimmering gold border fit for platform champions', preview: '#eab308' },
  { id: 'frame_purple', name: 'Royal Amethyst', type: 'frame', cost: 250, description: 'Imperial purple border with a mystical radiance', preview: '#a855f7' },
  { id: 'frame_ruby', name: 'Crimson Flame', type: 'frame', cost: 400, description: 'Blazing ruby red halo for fierce puzzle masters', preview: '#ef4444' },

  // Player Titles
  { id: 'title_prodigy', name: 'Puzzle Prodigy', type: 'title', cost: 150, description: 'Displays "[Puzzle Prodigy]" beneath your gamertag', preview: 'Puzzle Prodigy' },
  { id: 'title_wizard', name: 'Word Wizard', type: 'title', cost: 200, description: 'Displays "[Word Wizard]" beneath your gamertag', preview: 'Word Wizard' },
  { id: 'title_grandmaster', name: 'Grid Grandmaster', type: 'title', cost: 250, description: 'Displays "[Grid Grandmaster]" beneath your gamertag', preview: 'Grid Grandmaster' },
  { id: 'title_mythic', name: 'Mythic Solver', type: 'title', cost: 500, description: 'Displays "[Mythic Solver]" beneath your gamertag', preview: 'Mythic Solver' },
];

export async function handleGetShop(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  const [currentUser, owned] = await Promise.all([
    env.DB.prepare('SELECT coins, selected_frame, selected_title FROM users WHERE id = ?')
      .bind(user.id).first<{ coins: number; selected_frame: string; selected_title: string }>(),
    env.DB.prepare('SELECT item_id FROM user_cosmetics WHERE user_id = ?')
      .bind(user.id).all<{ item_id: string }>(),
  ]);

  return jsonResponse({
    success: true,
    catalog: COSMETIC_CATALOG,
    owned: (owned.results || []).map(r => r.item_id),
    coins: currentUser?.coins ?? 0,
    selectedFrame: currentUser?.selected_frame || 'default',
    selectedTitle: currentUser?.selected_title || '',
  });
}

export async function handleBuyCosmetic(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: { itemId?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON payload', 400);
  }

  const itemId = body.itemId?.trim();
  const item = COSMETIC_CATALOG.find(i => i.id === itemId);
  if (!item) {
    return errorResponse(`Cosmetic item '${itemId}' not found in catalog`, 404);
  }

  // Check if already owned
  const existing = await env.DB.prepare(
    'SELECT id FROM user_cosmetics WHERE user_id = ? AND item_id = ?'
  ).bind(user.id, item.id).first();

  if (existing) {
    return errorResponse('You already own this cosmetic item!', 400);
  }

  // Check coin balance
  const currentUser = await env.DB.prepare('SELECT coins FROM users WHERE id = ?')
    .bind(user.id).first<{ coins: number }>();

  if (!currentUser || currentUser.coins < item.cost) {
    return errorResponse(`Insufficient coins. '${item.name}' costs ${item.cost} coins. You have ${currentUser?.coins ?? 0} coins.`, 400, {
      code: 'INSUFFICIENT_COINS',
      cost: item.cost,
      coins: currentUser?.coins ?? 0,
    });
  }

  // Atomic batch: deduct coins and grant cosmetic
  await env.DB.batch([
    env.DB.prepare('UPDATE users SET coins = coins - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND coins >= ?')
      .bind(item.cost, user.id, item.cost),
    env.DB.prepare('INSERT INTO user_cosmetics (id, user_id, item_id, item_type, purchased_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)')
      .bind(`cos_${user.id}_${item.id}`, user.id, item.id, item.type),
  ]);

  const updatedUser = await env.DB.prepare('SELECT coins FROM users WHERE id = ?')
    .bind(user.id).first<{ coins: number }>();

  return jsonResponse({
    success: true,
    message: `Successfully purchased '${item.name}'!`,
    item,
    remainingCoins: updatedUser?.coins ?? (currentUser.coins - item.cost),
  });
}

export async function handleEquipCosmetic(
  request: Request,
  env: Env,
  user: AuthenticatedUser
): Promise<Response> {
  let body: { frame?: string; title?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON payload', 400);
  }

  const ownedRows = await env.DB.prepare('SELECT item_id FROM user_cosmetics WHERE user_id = ?')
    .bind(user.id).all<{ item_id: string }>();
  const ownedSet = new Set((ownedRows.results || []).map(r => r.item_id));

  const updates: string[] = [];
  const params: any[] = [];

  if (body.frame !== undefined) {
    if (body.frame !== 'default' && !ownedSet.has(body.frame)) {
      return errorResponse('You do not own this avatar frame', 403);
    }
    updates.push('selected_frame = ?');
    params.push(body.frame);
  }

  if (body.title !== undefined) {
    if (body.title !== '' && !ownedSet.has(body.title)) {
      return errorResponse('You do not own this title', 403);
    }
    updates.push('selected_title = ?');
    params.push(body.title);
  }

  if (updates.length === 0) {
    return errorResponse('No cosmetic equipment changes provided', 400);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(user.id);

  await env.DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...params).run();

  const updatedUser = await env.DB.prepare('SELECT selected_frame, selected_title FROM users WHERE id = ?')
    .bind(user.id).first<{ selected_frame: string; selected_title: string }>();

  return jsonResponse({
    success: true,
    message: 'Cosmetic appearance updated!',
    selectedFrame: updatedUser?.selected_frame || 'default',
    selectedTitle: updatedUser?.selected_title || '',
  });
}
