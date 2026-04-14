// Temporary service worker fix
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Let browser handle all requests normally
  return;
});