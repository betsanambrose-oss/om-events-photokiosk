// sw.js — Service Worker for offline caching and auto updates

const CACHE_NAME = 'om-kiosk-v1';
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/kiosk.css',
  '/js/app.js',
  '/js/camera.js',
  '/js/api.js',
  '/js/qr.js',
  '/templates/templates.js',
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
  // Don't cache API calls or Netlify functions
  if (event.request.url.includes('/.netlify/') ||
      event.request.url.includes('fal.run') ||
      event.request.url.includes('fal.ai')) {
    return; // Let these go to network
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Cache successful GET responses
        if (event.request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for HTML pages
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});
