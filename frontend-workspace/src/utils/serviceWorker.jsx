/* eslint-disable no-unused-vars */
// src/utils/serviceWorker.js
// Service Worker registration and management utilities

const CACHE_NAME = 'tham-platform-v1.2.0';
const API_CACHE_NAME = 'tham-platform-api-v1';

// Assets to cache during install
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html',
  '/static/media/logo.svg',
  '/static/media/hero-bg.jpg'
];

// API routes to cache
const API_ROUTES_TO_CACHE = [
  '/api/auth/user',
  '/api/search/categories',
  '/api/search/skills',
  '/api/profile-owners/categories'
];

// Strategy configuration
const STRATEGIES = {
  STATIC: 'cache-first',
  API: 'network-first',
  IMAGES: 'cache-first',
  FONTS: 'cache-first'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ Service Worker activated successfully');
      return self.clients.claim();
    })
    .catch((error) => {
      console.error('❌ Service Worker activation failed:', error);
    })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    event.respondWith(handleImageRequest(request));
  } else if (url.pathname.match(/\.(woff|woff2|ttf|eot)$/)) {
    event.respondWith(handleFontRequest(request));
  } else {
    event.respondWith(handleStaticRequest(request));
  }
});

// API request handler - Network First strategy
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful API responses (except sensitive data)
    if (networkResponse.ok && shouldCacheApiRequest(request)) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('🌐 Network failed, trying cache for API:', request.url);
    
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API calls
    return new Response(
      JSON.stringify({ 
        error: 'You are offline and no cached data is available',
        code: 'NETWORK_ERROR'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Static asset handler - Cache First strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Cache missed, try network
    const networkResponse = await fetch(request);
    
    // Cache the new response for future visits
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, return offline page
    console.log('🌐 Network failed for static asset:', request.url);
    
    if (request.destination === 'document') {
      const offlinePage = await cache.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    // Fallback response
    return new Response('You are offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Image request handler - Cache First with stale-while-revalidate
async function handleImageRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    // Return cached image but update cache in background
    updateCacheInBackground(request, cache);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
    }
    return networkResponse;
  } catch (error) {
    // Return a placeholder image for failed requests
    return new Response(
      '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f3f4f6"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="#9ca3af">Image</text></svg>',
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
}

// Font request handler - Cache First
async function handleFontRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
    }
    return networkResponse;
  } catch (error) {
    // Font loading will fall back to system fonts
    return new Response(null, { status: 404 });
  }
}

// Background cache update
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silent fail for background updates
  }
}

// Determine if API request should be cached
function shouldCacheApiRequest(request) {
  const url = new URL(request.url);
  
  // Don't cache sensitive endpoints
  const sensitiveEndpoints = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/register',
    '/api/payment',
    '/api/admin'
  ];
  
  if (sensitiveEndpoints.some(endpoint => url.pathname.startsWith(endpoint))) {
    return false;
  }
  
  // Cache GET requests for data that doesn't change frequently
  return API_ROUTES_TO_CACHE.some(route => url.pathname.startsWith(route));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Get pending actions from IndexedDB
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
        
        // Remove successful action from queue
        await removePendingAction(action.id);
        
        console.log('✅ Synced pending action:', action.id);
      } catch (error) {
        console.error('❌ Failed to sync action:', action.id, error);
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/static/icons/icon-192x192.png',
    badge: '/static/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});

// IndexedDB utilities for offline queue
const DB_NAME = 'OfflineQueue';
const DB_VERSION = 1;
const STORE_NAME = 'pendingActions';

async function getPendingActions() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function removePendingAction(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    event.ports[0].postMessage({
      cacheName: CACHE_NAME,
      apiCacheName: API_CACHE_NAME
    });
  }
});

// Cache health check and cleanup
async function performCacheHealthCheck() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    let healthyEntries = 0;
    let expiredEntries = 0;
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response && response.ok) {
        healthyEntries++;
      } else {
        expiredEntries++;
        cache.delete(request);
      }
    }
    
    console.log(`🏥 Cache Health: ${healthyEntries} healthy, ${expiredEntries} expired entries`);
    
    return {
      healthyEntries,
      expiredEntries,
      totalEntries: healthyEntries + expiredEntries
    };
  } catch (error) {
    console.error('❌ Cache health check failed:', error);
    return null;
  }
}

// Periodic cache maintenance
setInterval(() => {
  performCacheHealthCheck();
}, 24 * 60 * 60 * 1000); // Run once per day

// Export utility functions for the main app
export const serviceWorkerUtils = {
  // Register service worker
  async register() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registered:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 New Service Worker found:', newWorker);
          
          newWorker.addEventListener('statechange', () => {
            console.log('🔄 Service Worker state:', newWorker.state);
          });
        });
        
        return registration;
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  },
  
  // Unregister service worker
  async unregister() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.unregister();
        console.log('✅ Service Worker unregistered');
        return true;
      } catch (error) {
        console.error('❌ Service Worker unregistration failed:', error);
        return false;
      }
    }
    return false;
  },
  
  // Check for updates
  async checkForUpdate() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
        console.log('✅ Service Worker update check completed');
        return true;
      } catch (error) {
        console.error('❌ Service Worker update check failed:', error);
        return false;
      }
    }
    return false;
  },
  
  // Get cache status
  async getCacheStatus() {
    return new Promise((resolve) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          const channel = new MessageChannel();
          channel.port1.onmessage = (event) => {
            resolve(event.data);
          };
          registration.active.postMessage(
            { type: 'GET_CACHE_STATUS' },
            [channel.port2]
          );
        });
      } else {
        resolve(null);
      }
    });
  },
  
  // Clear all caches
  async clearCaches() {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('✅ All caches cleared');
      return true;
    } catch (error) {
      console.error('❌ Cache clearing failed:', error);
      return false;
    }
  },
  
  // Precache specific URLs
  async precacheUrls(urls) {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(urls);
      console.log(`✅ Pre-cached ${urls.length} URLs`);
      return true;
    } catch (error) {
      console.error('❌ Pre-caching failed:', error);
      return false;
    }
  }
};

// Export for use in main app
export default serviceWorker;

