// sw.js — Service Worker for offline caching and auto updates

const CACHE_NAME = 'om-kiosk-v4';
const CACHE_ASSETS = [
  '/om-events-photokiosk/',
  '/om-events-photokiosk/index.html',
  '/om-events-photokiosk/css/kiosk.css',
  '/om-events-photokiosk/js/app.js',
  '/om-events-photokiosk/js/camera.js',
  '/om-events-photokiosk/js/api.js',
  '/om-events-photokiosk/js/qr.js',
  '/om-events-photokiosk/templates/templates.js',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Montserrat:wght@300;400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

// Install — cache all assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_ASSETS).catch(err => {
        console.warn('Some assets failed to cache:', err);
      });
    })
  );
});

// Activate — clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Never cache Cloudflare Worker API calls or fal.ai
  if (event.request.url.includes('workers.dev') ||
      event.request.url.includes('fal.run') ||
      event.request.url.includes('fal.ai')) {
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
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/om-events-photokiosk/index.html');
        }
      });
    })
  );
});
