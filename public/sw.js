/**
 * Gamify Service Worker - Aggressive Stale-While-Revalidate Strategy
 * 
 * Caches shell HTML, static modules, and game assets so the app loads in 0ms,
 * while refreshing the cache in the background. Only /api/ endpoints bypass cache.
 */

const CACHE_NAME = 'gamify-sw-v7-adsense-ready';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/privacy.html',
  '/about.html',
  '/contact.html',
  '/terms.html',
  '/images/gamify-logo.png',
  '/images/word-guess.png',
  '/images/wordle.png',
  '/images/number-grid.png',
  '/images/number-trail.png',
  '/images/sudoku.png',
  '/images/memory-match.png',
  '/images/crossword.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache notice:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging old cache:', key);
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

  // 1. Never cache dynamic worker API requests
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 2. Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // 3. Stale-While-Revalidate for shell HTML and all static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is navigation/HTML, fallback to cached root
          if (
            event.request.mode === 'navigate' ||
            event.request.destination === 'document' ||
            url.pathname === '/' ||
            url.pathname.endsWith('.html')
          ) {
            return caches.match('/').then((root) => root || cachedResponse);
          }
          return cachedResponse;
        });

      // Return instantly from cache if available, else wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
