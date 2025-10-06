// The version of the cache.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `quran-player-${CACHE_VERSION}`;

// The core files of the application that should always be cached.
// These paths are relative to the root of your site.
const URLS_TO_CACHE = [
  '.',
  'index.html',
  'manifest.json',
  'js/main.js',
  'js/api.js',
  'js/ui.js',
  'js/player.js',
  'js/storage.js',
  'js/utils.js',
  // تم حذف سطر cdn.tailwindcss.com من هنا لأنه يسبب خطأ CORS
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap'
];

// 1. Installation: Cache the core files of the app.
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// 2. Activation: Clean up old caches.
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch: Serve from cache first, then network.
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For API requests to mp3quran.net, always go to the network.
  if (event.request.url.includes('mp3quran.net')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // If the request is in the cache, return it.
      if (response) {
        // console.log('[Service Worker] Returning from cache:', event.request.url);
        return response;
      }

      // If the request is not in the cache, fetch it from the network.
      // console.log('[Service Worker] Fetching from network:', event.request.url);
      return fetch(event.request);
    })
  );
});