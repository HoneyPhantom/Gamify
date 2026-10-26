/**
 * Gamify Service Worker - Network-First for Navigation, Stale-While-Revalidate for Assets
 * Guarantees users always receive the newest deployed version when online,
 * while maintaining full offline PWA functionality.
 */

const CACHE_NAME = 'gamify-v3-networkfirst';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/images/gamify-logo.png',
  '/images/wordle.png',
  '/images/number-grid.png',
  '/images/number-trail.png',
  '/images/sudoku.png',
  '/images/memory-match.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Never intercept or cache API requests
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 2. Navigation / HTML requests: Network-First (guarantees newest deployed version)
  const isNav = event.request.mode === 'navigate' ||
                event.request.destination === 'document' ||
                url.pathname === '/' ||
                url.pathname.endsWith('.html');

  if (isNav) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkRes;
        })
        .catch(() => {
          // If offline, serve from cache
          return caches.match(event.request).then((cached) => cached || caches.match('/'));
        })
    );
    return;
  }

  // 3. Static Assets: Stale-While-Revalidate (instant load + background refresh)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});
