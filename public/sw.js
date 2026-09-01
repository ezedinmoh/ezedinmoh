const CACHE_VERSION = 'ezedinmoh-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-icon.png',
];

const MAX_IMAGE_CACHE_ENTRIES = 50;

// Helper: Trim cache to max items
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    trimCache(cacheName, maxItems);
  }
}

// Install Event - Pre-cache Static Shell Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Purge Obsolete Caches & Take Control
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('ezedinmoh-') && !currentCaches.includes(cacheName)) {
            console.log('[SW] Deleting obsolete cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Message Event - Support live skipWaiting update triggers
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch Event - Route & Strategy Handling
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET requests & non-http(s) schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 2. NetworkOnly for API endpoints & Next.js HMR/Dev tools (Security & Freshness)
  if (url.pathname.startsWith('/api/') || url.pathname.includes('/_next/webpack-hmr')) {
    return;
  }

  // 3. NetworkOnly for large video assets (.mp4, .webm)
  if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm')) {
    return;
  }

  // 4. CacheFirst Strategy for Images (with max entry limit)
  if (
    request.destination === 'image' ||
    /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(request, responseClone);
              trimCache(IMAGE_CACHE, MAX_IMAGE_CACHE_ENTRIES);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 5. NetworkFirst Strategy for Page Navigations (with /offline Fallback)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to /offline page if uncached
          const offlinePage = await caches.match('/offline');
          if (offlinePage) {
            return offlinePage;
          }
          return new Response('Offline - Connection unavailable', {
            status: 533,
            headers: { 'Content-Type': 'text/plain' },
          });
        })
    );
    return;
  }

  // 6. StaleWhileRevalidate for Static Assets (CSS, JS, Fonts)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
