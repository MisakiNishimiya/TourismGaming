const CACHE_NAME = 'pantukan-v4'; // Bump version to force update
const OFFLINE_URL = '/login.html';

const CACHE_URLS = [
  '/',
  '/index.html',
  '/login.html',
  '/customer-dashboard.html',
  '/host-dashboard.html',
  '/map.html',
  '/manifest.json',
  '/package/beach.html',
  '/package/adventure.html',
  '/package/nature.html',
  '/package/cultural.html',
  '/package/culinary.html',
  '/package/family.html',
  '/js/firebase-config.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  '/assets/app-icon.png'
];

// ... (Install and Activate events remain the same) ...

// Install Event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v4...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v4...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch Event - Network First, Fallback to Cache
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.log('[SW] Network failed, checking cache for:', event.request.url);
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For non-navigation requests (images, scripts), use Cache First


  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

function syncData() {
  return Promise.resolve();
}