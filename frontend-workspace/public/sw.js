const CACHE_NAME = 'tham-platform-v2';
const STATIC_CACHE = 'tham-static-v2';
const DYNAMIC_CACHE = 'tham-dynamic-v2';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/vite.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache-first for static assets
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
    return;
  }

  // Network-first for API calls with fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(DYNAMIC_CACHE).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Stale-while-revalidate for other assets
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        caches.open(DYNAMIC_CACHE).then(cache => cache.put(event.request, response.clone()));
        return response;
      });
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
        .map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});
