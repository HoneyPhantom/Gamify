/**
 * Seeded Pseudo-Random Number Generator (PRNG) Suite
 * Uses SplitMix32 for string hashing and Mulberry32 for fast, deterministic 32-bit state generation.
 */

/**
 * 32-bit FNV-1a hash algorithm to convert arbitrary string seeds (e.g., '2026-10-16:number-grid:hard')
 * into a solid 32-bit unsigned integer seed.
 * 
 * @param {string} str 
 * @returns {number} 32-bit integer
 */
export function hashStringSeed(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Mulberry32 Generator
 * Deterministic PRNG with 32 bits of state and 2^32 period.
 * 
 * @param {number|string} seed 
 * @returns {() => number} Returns float in [0, 1)
 */
export function createMulberry32(seed) {
  let s = typeof seed === 'string' ? hashStringSeed(seed) : (seed >>> 0);

  return function next() {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Helper class providing convenient deterministic math primitives
 */
export class SeededRNG {
  constructor(seed) {
    this.random = createMulberry32(seed);
  }

  /**
   * Random float between min (inclusive) and max (exclusive)
   */
  nextFloat(min = 0, max = 1) {
    return min + this.random() * (max - min);
  }

  /**
   * Random integer between min (inclusive) and max (inclusive)
   */
  nextInt(min, max) {
    return Math.floor(this.nextFloat(min, max + 1));
  }

  /**
   * Deterministic Fisher-Yates shuffle
   */
  shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
