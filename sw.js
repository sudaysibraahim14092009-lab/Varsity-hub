const CACHE_NAME = 'scholrza-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png',
  '/og-image.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});

