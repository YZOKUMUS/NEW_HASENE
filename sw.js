const CACHE_NAME = 'hasene-arabic-v1.0';
const urlsToCache = [
  '/HASENE/',
  '/HASENE/index.html',
  '/HASENE/manifest.json',
  '/HASENE/icon-192-v4-RED-MUSHAF.png',
  '/HASENE/icon-512-v4-RED-MUSHAF.png',
  '/HASENE/KFGQPC Uthmanic Script HAFS Regular.otf',
  '/HASENE/kelimebul.json',
  '/HASENE/ayetoku_formatted.json',
  '/HASENE/duaet.json',
  '/HASENE/hadisoku.json'
];

// Install event - cache files
// Toggle this to true if you need SW logs during debugging
const SW_DEBUG = false;

self.addEventListener('install', event => {
  if (SW_DEBUG) console.debug('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        if (SW_DEBUG) console.debug('📦 Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        if (SW_DEBUG) console.debug('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  if (SW_DEBUG) console.debug('🚀 Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            if (SW_DEBUG) console.debug('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      if (SW_DEBUG) console.debug('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          if (SW_DEBUG) console.debug('📱 Serving from cache:', event.request.url);
          return response;
        }
        
        if (SW_DEBUG) console.debug('🌐 Fetching from network:', event.request.url);
        return fetch(event.request).then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/HASENE/index.html');
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    if (SW_DEBUG) console.debug('🔄 Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions when back online
  if (SW_DEBUG) console.debug('📡 Performing background sync...');
}

// Push notifications (future feature)
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/HASENE/icon-192-v4-RED-MUSHAF.png',
      badge: '/HASENE/icon-192-v4-RED-MUSHAF.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('Hasene Arapça Oyunu', options)
    );
  }
});

if (SW_DEBUG) console.debug('🎮 Hasene Arabic Game Service Worker loaded!');