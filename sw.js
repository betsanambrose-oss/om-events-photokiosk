// sw.js — Service Worker v5
// Caches all app files for offline use
// Never caches API calls

const CACHE_NAME = 'om-kiosk-v6';

const CACHE_ASSETS = [
  '/om-events-photokiosk/',
  '/om-events-photokiosk/index.html',
  '/om-events-photokiosk/download.html',
  '/om-events-photokiosk/css/kiosk.css',
  '/om-events-photokiosk/js/app.js',
  '/om-events-photokiosk/js/api.js',
  '/om-events-photokiosk/js/camera.js',
  '/om-events-photokiosk/js/qr.js',
  '/om-events-photokiosk/js/settings.js',
  '/om-events-photokiosk/js/network.js',
  '/om-events-photokiosk/js/tracker.js',
  '/om-events-photokiosk/js/gender.js',
  '/om-events-photokiosk/templates/templates.js'
];

// Install — cache core assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache individually so one failure doesn't block others
      return Promise.allSettled(
        CACHE_ASSETS.map(url => cache.add(url).catch(e => console.warn('Cache miss:', url)))
      );
    })
  );
});

// Activate — clear all old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch — cache first, fallback to network
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Never intercept: API calls, fal.ai, external CDNs
  if (url.includes('workers.dev') ||
      url.includes('fal.run') ||
      url.includes('fal.media') ||
      url.includes('fal.ai') ||
      url.includes('googleapis.com') ||
      url.includes('jsdelivr.net') ||
      url.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (event.request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for HTML requests
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/om-events-photokiosk/index.html');
        }
      });
    })
  );
});
