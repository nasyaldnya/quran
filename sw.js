// ============================================================
// sw.js — Service Worker
// Cache strategies: App Shell = Cache First, Fonts = SWR, API = Network Only
// ============================================================

const VERSION    = 'v2';
const CACHE_NAME = `quran-player-${VERSION}`;

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/js/state.js',
  '/js/utils.js',
  '/js/storage.js',
  '/js/api.js',
  '/js/i18n.js',
  '/js/ui.js',
  '/js/player.js',
  '/js/main.js',
];

// ── Install: Cache app shell ─────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ── Activate: Clean old caches ───────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: Strategy router ───────────────────────────────────

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // ── Network Only: API calls and audio files ──────────────
  if (
    url.hostname === 'mp3quran.net' ||
    url.pathname.endsWith('.mp3')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // ── Stale While Revalidate: Google Fonts ────────────────
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // ── Cache First: App shell and static assets ────────────
  event.respondWith(cacheFirst(event.request));
});

// ── Strategy implementations ─────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline fallback: return index.html for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache  = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || (await fetchPromise) || new Response('Offline', { status: 503 });
}
