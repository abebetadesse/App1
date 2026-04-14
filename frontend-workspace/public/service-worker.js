// Tham Platform Service Worker - Production Only
const CACHE_NAME = 'tham-cache-v1';

// Skip service worker during development
const isDevelopment = self.location.hostname === 'localhost' || 
                      self.location.hostname === '127.0.0.1' ||
                      self.location.port === '5173';

if (isDevelopment) {
  self.addEventListener('install', () => {
    self.skipWaiting();
  });
  self.addEventListener('activate', () => {
    clients.claim();
  });
  // Don't cache anything in development
  self.addEventListener('fetch', (event) => {
    return;
  });
} else {
  // Production caching strategy
  const urlsToCache = [
    '/',
    '/index.html',
    '/favicon.svg',
    '/manifest.json'
  ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
  });

  self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests and API calls
    if (!event.request.url.startsWith(self.location.origin) ||
        event.request.url.includes('/api/') ||
        event.request.url.includes('chrome-extension')) {
      return;
    }
    
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
}

// Clean old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
